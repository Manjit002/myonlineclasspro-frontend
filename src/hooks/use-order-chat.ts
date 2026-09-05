"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client, StompSubscription } from "@stomp/stompjs";
import { API_BASE_URL, getToken, getUserId } from "@/lib/api-client";
import {
  getChatHistory,
  getChatPage,
  markMessageSeen,
  uploadChatFile,
} from "@/services/student-service";
import type { ChatMessage } from "@/types/dashboard";
import { useChatNotifier } from "@/components/dashboard/chat-notifications";

/**
 * Order chat over STOMP/SockJS.
 *
 * Connection lifecycle is the delicate part of this conversion:
 *
 *  - ONE client per mount. The client lives in a ref, never in state, so
 *    re-renders can't create duplicates.
 *  - Order-specific topics are tracked separately from the two global
 *    subscriptions, so switching order tears down only the per-order ones
 *    while the socket itself stays up.
 *  - onConnect re-subscribes to whatever order is current, which is also
 *    what restores subscriptions after an automatic reconnect.
 *  - Unmount deactivates the client and clears every subscription, so a
 *    stale socket can't deliver messages into a different order's view.
 *
 * Destinations and the send payload match the backend contract exactly.
 */

const SOCK_URL = `${API_BASE_URL}/ws/chat`;

export interface ChatState {
  messages: ChatMessage[];
  connected: boolean;
  loading: boolean;
  error: string | null;
  typing: boolean;
  counterpartOnline: boolean;
  hasMore: boolean;
  loadingOlder: boolean;
}

export function useOrderChat(orderId: number | null) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    connected: false,
    loading: true,
    error: null,
    typing: false,
    counterpartOnline: false,
    hasMore: true,
    loadingOlder: false,
  });

  const clientRef = useRef<Client | null>(null);
  const orderSubsRef = useRef<StompSubscription[]>([]);
  const orderIdRef = useRef<number | null>(orderId);
  const counterpartRef = useRef<string | null>(null);
  const pageRef = useRef(0);
  const typingHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingSendRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userId = getUserId();
  const { notify } = useChatNotifier();

  /* @stomp/stompjs throws "There is no underlying STOMP connection" if
     publish() is called while the client exists but isn't connected. The
     REST history fetch resolves before the SockJS handshake completes, so
     the seen-receipt below raced the connection and threw inside a
     promise -- surfacing as an unhandledRejection.

     A `connected` check alone isn't enough either: send() awaits a file
     upload between checking and publishing, so the socket can drop in
     between. Hence the try/catch as well. */
  const publishSafe = useCallback(
    (destination: string, body: unknown): boolean => {
      const client = clientRef.current;
      if (!client?.connected) return false;
      try {
        client.publish({
          destination,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        return true;
      } catch {
        // Connection dropped between the check and the call.
        return false;
      }
    },
    [],
  );

  /* Seen receipts that couldn't be delivered are queued and flushed once
     the connection is up, rather than silently dropped. The REST call
     already persists the state; this is the realtime broadcast. */
  const pendingSeenRef = useRef<number[]>([]);
  const publishSeen = useCallback(
    (messageId: number) => {
      const payload = {
        messageId,
        userId: userId ? parseInt(userId, 10) : null,
      };
      if (!publishSafe("/app/chat.seen", payload)) {
        pendingSeenRef.current.push(messageId);
      }
    },
    [publishSafe, userId],
  );
  const flushSeen = useCallback(() => {
    const queued = pendingSeenRef.current;
    if (!queued.length) return;
    pendingSeenRef.current = [];
    queued.forEach((id) => publishSeen(id));
  }, [publishSeen]);
  const flushSeenRef = useRef(flushSeen);
  useEffect(() => {
    flushSeenRef.current = flushSeen;
  }, [flushSeen]);

  // Kept in sync via an effect: writing a ref during render is not allowed.
  useEffect(() => {
    orderIdRef.current = orderId;
  }, [orderId]);

  /** Tear down only the per-order topics, leaving the socket connected. */
  const unsubscribeOrder = useCallback(() => {
    orderSubsRef.current.forEach((s) => {
      try {
        s.unsubscribe();
      } catch {
        /* already gone */
      }
    });
    orderSubsRef.current = [];
  }, []);

  const handleIncoming = useCallback(
    (m: ChatMessage) => {
      // Notify before the order guard: a message for a different order is
      // still a new message the student should hear about. Only inbound
      // messages notify — never the student's own echo.
      if (m.senderRole && m.senderRole !== "STUDENT") {
        notify(m);
      }
      // Guard against a late frame from a previously-open order.
      if (m.orderId !== orderIdRef.current) return;
      setState((s) =>
        s.messages.some((x) => x.messageId === m.messageId)
          ? s
          : { ...s, messages: [...s.messages, m] },
      );
      if (m.senderRole && m.senderRole !== "STUDENT") {
        counterpartRef.current = String(m.senderId);
      }
    },
    [notify],
  );

  const handleStatus = useCallback((m: ChatMessage) => {
    if (m.orderId !== orderIdRef.current) return;
    setState((s) => ({
      ...s,
      messages: s.messages.map((x) => (x.messageId === m.messageId ? m : x)),
    }));
  }, []);

  const subscribeOrder = useCallback(
    (client: Client, id: number) => {
      unsubscribeOrder();
      const j = (b: string) => JSON.parse(b) as ChatMessage;
      orderSubsRef.current = [
        client.subscribe(`/topic/chat/${id}`, (f) => handleIncoming(j(f.body))),
        client.subscribe(`/topic/chat/${id}/delivered`, (f) =>
          handleStatus(j(f.body)),
        ),
        client.subscribe(`/topic/chat/${id}/seen`, (f) =>
          handleStatus(j(f.body)),
        ),
        client.subscribe(`/topic/chat/${id}/typing`, (f) => {
          const dto = JSON.parse(f.body) as {
            orderId: number;
            senderId: string | number;
            typing: boolean;
          };
          if (dto.orderId !== orderIdRef.current) return;
          if (String(dto.senderId) === String(userId)) return;
          setState((s) => ({ ...s, typing: dto.typing }));
          if (typingHideRef.current) clearTimeout(typingHideRef.current);
          if (dto.typing) {
            typingHideRef.current = setTimeout(
              () => setState((s) => ({ ...s, typing: false })),
              3000,
            );
          }
        }),
      ];
    },
    [handleIncoming, handleStatus, unsubscribeOrder, userId],
  );

  // Single connection for the lifetime of the mount.
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    (async () => {
      // SockJS touches `window`, so it can only be imported in the browser.
      const [{ Client: StompClient }, SockJS] = await Promise.all([
        import("@stomp/stompjs"),
        import("sockjs-client").then((m) => m.default ?? m),
      ]);
      if (cancelled) return;

      const client = new StompClient({
        webSocketFactory: () =>
          new (SockJS as unknown as new (u: string) => WebSocket)(SOCK_URL),
        connectHeaders: { Authorization: `Bearer ${getToken()}` },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: () => {},
        onConnect: () => {
          setState((s) => ({ ...s, connected: true, error: null }));
          client.subscribe("/user/queue/messages", (f) =>
            handleIncoming(JSON.parse(f.body) as ChatMessage),
          );
          client.subscribe("/topic/presence", (f) => {
            const dto = JSON.parse(f.body) as {
              userId: string | number;
              online: boolean;
            };
            if (!counterpartRef.current) return;
            if (String(dto.userId) !== counterpartRef.current) return;
            setState((s) => ({ ...s, counterpartOnline: dto.online }));
          });
          // Also restores per-order topics after an automatic reconnect.
          if (orderIdRef.current) subscribeOrder(client, orderIdRef.current);
          // Deliver any seen receipts that raced the handshake.
          flushSeenRef.current();
        },
        onDisconnect: () => setState((s) => ({ ...s, connected: false })),
        onWebSocketClose: () => setState((s) => ({ ...s, connected: false })),
        onStompError: (frame) =>
          setState((s) => ({
            ...s,
            connected: false,
            error: frame.headers?.message || "Chat connection error",
          })),
      });

      clientRef.current = client;
      client.activate();
    })();

    return () => {
      cancelled = true;
      unsubscribeOrder();
      if (typingHideRef.current) clearTimeout(typingHideRef.current);
      if (typingSendRef.current) clearTimeout(typingSendRef.current);
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
    // Intentionally keyed on mount only: switching order re-subscribes via the
    // effect below rather than rebuilding the socket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Order switch: swap topics on the existing connection.
  useEffect(() => {
    if (!orderId) return;
    const client = clientRef.current;
    if (client?.connected) subscribeOrder(client, orderId);
    return () => unsubscribeOrder();
  }, [orderId, subscribeOrder, unsubscribeOrder]);

  // History for the selected order.
  useEffect(() => {
    if (!orderId) return;
    let alive = true;
    pageRef.current = 0;
    getChatHistory(orderId).then((r) => {
      if (!alive) return;
      if (!r.ok) {
        setState((s) => ({ ...s, loading: false, error: r.error }));
        return;
      }
      const list = r.data ?? [];
      const other = list.find(
        (m) => m.senderRole && m.senderRole !== "STUDENT",
      );
      counterpartRef.current = other ? String(other.senderId) : null;
      setState((s) => ({ ...s, loading: false, messages: list, error: null }));
      // Mark anything unread from the other side as seen.
      list
        .filter((m) => String(m.senderId) !== String(userId) && !m.seen)
        .forEach((m) => {
          markMessageSeen(m.messageId);
          publishSeen(m.messageId);
        });
    });
    return () => {
      alive = false;
    };
  }, [orderId, userId, publishSeen]);

  const loadOlder = useCallback(async () => {
    if (!orderId || state.loadingOlder || !state.hasMore) return;
    setState((s) => ({ ...s, loadingOlder: true }));
    pageRef.current += 1;
    const r = await getChatPage(orderId, pageRef.current);
    if (!r.ok || !r.data?.content?.length) {
      setState((s) => ({ ...s, loadingOlder: false, hasMore: false }));
      return;
    }
    // Endpoint returns newest-first; prepend oldest-first.
    const older = [...r.data.content].reverse();
    setState((s) => ({
      ...s,
      loadingOlder: false,
      messages: [...older, ...s.messages],
    }));
  }, [orderId, state.loadingOlder, state.hasMore]);

  const send = useCallback(
    async (text: string, files: File[], replyToMessageId: number | null) => {
      if (!clientRef.current?.connected || !orderId) return;

      const publish = (fields: Partial<ChatMessage>) =>
        publishSafe("/app/chat.send", {
          orderId,
          senderId: userId ? parseInt(userId, 10) : null,
          senderRole: "STUDENT",
          message: fields.message ?? "",
          messageType: fields.messageType ?? "TEXT",
          replyToMessageId,
          fileKey: (fields as { fileKey?: string }).fileKey ?? null,
          fileName: fields.fileName ?? null,
          contentType: fields.contentType ?? null,
          fileSize: fields.fileSize ?? null,
        });

      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          const up = await uploadChatFile(files[i]);
          if (!up.ok) continue;
          const ct = up.data.contentType ?? "";
          publish({
            message: i === files.length - 1 ? text : "",
            messageType: ct.startsWith("image/")
              ? "IMAGE"
              : ct.startsWith("video/")
                ? "VIDEO"
                : "DOCUMENT",
            fileName: up.data.fileName,
            contentType: ct,
            fileSize: up.data.fileSize,
            ...({ fileKey: up.data.fileKey } as object),
          });
        }
      } else if (text.trim()) {
        publish({ message: text, messageType: "TEXT" });
      }
    },
    [orderId, userId, publishSafe],
  );

  /** Debounced so typing events aren't published on every keystroke. */
  const sendTypingRef = useRef<(t: boolean, n: string) => void>(() => {});
  const sendTyping = useCallback(
    (isTyping: boolean, senderName: string) => {
      if (!orderId) return;
      publishSafe("/app/chat.typing", {
        orderId,
        senderId: userId ? parseInt(userId, 10) : null,
        senderName,
        typing: isTyping,
      });
      if (isTyping) {
        if (typingSendRef.current) clearTimeout(typingSendRef.current);
        typingSendRef.current = setTimeout(
          () => sendTypingRef.current(false, senderName),
          2000,
        );
      }
    },
    [orderId, userId, publishSafe],
  );

  useEffect(() => {
    sendTypingRef.current = sendTyping;
  }, [sendTyping]);

  return { ...state, send, sendTyping, loadOlder, userId };
}

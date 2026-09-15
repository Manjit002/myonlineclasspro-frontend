"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MessageSquare, X } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import type { ChatMessage } from "@/types/dashboard";

/**
 * In-app toast for incoming chat messages.
 *
 * This is presentation only — it does not open a socket or poll. It is
 * fed by the existing incoming-message handler, so a message notifies
 * exactly once, on the same event that already appends it to the
 * conversation.
 *
 * Dedupe is keyed on the backend's messageId and held in a ref, so React
 * re-renders, reconnects, remounts and dashboard navigation cannot
 * replay a notification for a message already seen.
 */

const MIN_VISIBLE_MS = 1000; // required floor
const HOLD_MS = 4200; // total time on screen before auto-dismiss
const MAX_STACK = 3; // beyond this, collapse into a count

export interface ChatToast {
  id: number;
  sender: string;
  preview: string;
  at: number;
}

interface Ctx {
  /** Called from the existing incoming-message handler. */
  notify: (m: ChatMessage, senderName?: string) => void;
}

const ChatNotifyContext = createContext<Ctx>({ notify: () => {} });

/** Available anywhere under the dashboard shell. */
export function useChatNotifier() {
  return useContext(ChatNotifyContext);
}

function previewOf(m: ChatMessage): string {
  if (m.message?.trim()) return m.message.trim();
  if (m.messageType === "IMAGE") return "📷 Photo";
  if (m.fileName) return `📎 ${m.fileName}`;
  return "New attachment";
}

export function ChatNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const [toasts, setToasts] = useState<ChatToast[]>([]);
  const [extra, setExtra] = useState(0);
  const seen = useRef<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  const notify = useCallback(
    (m: ChatMessage, senderName = "Support Team") => {
      if (m.messageId == null) return;
      // The student's own message is never news to them. Guarded here as
      // well as at the call site so no future caller can trip it.
      if (m.senderRole === "STUDENT") return;
      // One notification per message, ever.
      if (seen.current.has(m.messageId)) return;
      seen.current.add(m.messageId);

      const toast: ChatToast = {
        id: m.messageId,
        sender: senderName,
        preview: previewOf(m),
        at: Date.now(),
      };

      setToasts((list) => {
        if (list.length >= MAX_STACK) {
          // Burst of messages: keep the newest few visible and count the rest
          // rather than growing an unbounded column of toasts.
          setExtra((n) => n + 1);
          return list;
        }
        return [...list, toast];
      });

      // HOLD_MS is comfortably above the 1s floor; the exit animation runs
      // after this, so the toast is on screen for at least MIN_VISIBLE_MS.
      const timer = setTimeout(
        () => dismiss(toast.id),
        Math.max(MIN_VISIBLE_MS, HOLD_MS),
      );
      timers.current.set(toast.id, timer);
    },
    [dismiss],
  );

  // Clear the aggregate counter once the stack drains.
  useEffect(() => {
    if (toasts.length === 0 && extra > 0) {
      const t = setTimeout(() => setExtra(0), 400);
      return () => clearTimeout(t);
    }
  }, [toasts.length, extra]);

  /* Test seam: exposes the same notify() the chat handler calls, so the
     toast behaviour can be exercised without a live STOMP broker. Only
     attached when explicitly opted in via ?e2e=1. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!new URLSearchParams(window.location.search).has("e2e")) return;
    (window as unknown as { __chatNotify?: Ctx["notify"] }).__chatNotify =
      notify;
  }, [notify]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ChatNotifyContext.Provider value={{ notify }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="chat-toast-layer"
            role="status"
            aria-live="polite"
            aria-atomic="false"
          >
            {toasts.map((t) => (
              <article key={t.id} className="chat-toast">
                <span className="chat-toast-icon" aria-hidden>
                  <MessageSquare size={16} />
                </span>
                <span className="chat-toast-body">
                  <span className="chat-toast-head">
                    <span className="chat-toast-sender">{t.sender}</span>
                    <span className="chat-toast-time">Just now</span>
                  </span>
                  <span className="chat-toast-preview">{t.preview}</span>
                </span>
                <button
                  type="button"
                  className="chat-toast-close"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </article>
            ))}
            {extra > 0 && (
              <p className="chat-toast-more">
                +{extra} more new message{extra === 1 ? "" : "s"}
              </p>
            )}
          </div>,
          document.body,
        )}
    </ChatNotifyContext.Provider>
  );
}

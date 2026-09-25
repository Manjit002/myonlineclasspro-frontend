"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  X,
  CornerUpLeft,
  Headphones,
  MessageSquare,
} from "lucide-react";
import { useOrderChat } from "@/hooks/use-order-chat";
import { formatBytes } from "@/lib/api-client";
import type { ChatMessage } from "@/types/dashboard";

/** WhatsApp mark — identical to the site header's glyph. */
const WA_GLYPH =
  "M16 2C8.268 2 2 8.268 2 16c0 2.49.652 4.83 1.792 6.858L2 30l7.338-1.765A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.248 0-4.348-.6-6.15-1.646l-.44-.26-4.356 1.05 1.076-4.238-.286-.458A11.564 11.564 0 014.4 16C4.4 9.594 9.594 4.4 16 4.4S27.6 9.594 27.6 16 22.406 27.6 16 27.6zm6.348-8.72c-.348-.174-2.06-1.016-2.38-1.132-.318-.116-.55-.174-.78.174-.232.348-.9 1.132-1.1 1.364-.202.232-.404.26-.75.086-.35-.174-1.476-.544-2.81-1.734-1.04-.928-1.742-2.072-1.946-2.42-.204-.348-.022-.536.152-.708.158-.156.35-.406.524-.61.174-.202.232-.348.348-.58.116-.232.058-.434-.03-.61-.086-.174-.78-1.882-1.07-2.578-.282-.676-.568-.584-.78-.594-.202-.01-.434-.012-.666-.012-.232 0-.61.086-.928.434-.318.348-1.214 1.188-1.214 2.896 0 1.708 1.244 3.358 1.418 3.59.174.232 2.448 3.738 5.934 5.24.83.358 1.478.572 1.982.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.29-.812.29-1.508.204-1.656-.086-.144-.318-.232-.668-.406z";

const MAX_CHAT_BYTES = 25 * 1024 * 1024; // 25 MB chat attachment ceiling

function dayLabel(ms?: number) {
  if (!ms) return "";
  const d = new Date(ms),
    now = new Date();
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const b = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const diff = Math.round((b - a) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
const clock = (ms?: number) =>
  ms
    ? new Date(ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

/** Display name for typing events, read at call time so no state is needed. */
function currentStudentName() {
  if (typeof window === "undefined") return "Student";
  return localStorage.getItem("userEmail")?.split("@")[0] ?? "Student";
}

export function OrderChat({ orderId }: { orderId: number }) {
  const chat = useOrderChat(orderId);
  const [text, setText] = useState("");
  const [queue, setQueue] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [drag, setDrag] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const count = chat.messages.length;

  /* Third-party floating widgets (Zoho SalesIQ) inject straight into
     <body>, outside React, so unmounting their <Script> cannot remove an
     already-injected node — it survives a client-side navigation onto the
     dashboard and lands on top of the composer. Flagging the body while
     this chat is mounted lets CSS lift those widgets clear, rather than
     hiding them or fighting with z-index. */
  const composerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle(
          "dashboard-chat-open",
          entry.isIntersecting,
        );
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.body.classList.remove("dashboard-chat-open");
    };
  }, []);

  // Stick to the bottom as new messages arrive.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  // Older messages load when scrolled near the top.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop < 60) chat.loadOlder();
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [chat]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_CHAT_BYTES) continue;
      next.push(f);
    }
    if (next.length) setQueue((p) => [...p, ...next]);
  };

  async function submit() {
    if (!text.trim() && !queue.length) return;
    await chat.send(text, queue, replyTo?.messageId ?? null);
    setText("");
    setQueue([]);
    setReplyTo(null);
  }

  // Precomputed instead of mutating a variable while rendering.
  const dayFlags = new Map<number, string>();
  chat.messages.reduce((prev, m) => {
    const label = dayLabel(m.createdAt);
    if (label !== prev) dayFlags.set(m.messageId, label);
    return label;
  }, "");

  return (
    <div className="db-chat">
      <header className="db-chat-head">
        <span className="db-chat-av" aria-hidden>
          S
        </span>
        <span className="db-chat-head-txt">
          <span className="db-chat-name">Support Team</span>
          <span className="db-dim">
            {chat.connected
              ? chat.counterpartOnline
                ? "Online"
                : "Connected"
              : "Connecting…"}
          </span>
        </span>
        <span
          className={["db-chat-dot", chat.connected && "is-on"]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        />
      </header>

      <div
        ref={bodyRef}
        className={[
          "db-chat-body",
          drag && "is-drag",
          // History is loaded but the socket isn't live yet: hide the
          // conversation behind the reconnect notice. visibility (not
          // display) so the rows keep their layout box — the overlay
          // still sits over real content and nothing reflows when it
          // clears.
          !chat.connected &&
            !chat.error &&
            chat.messages.length > 0 &&
            "is-reconnecting",
        ]
          .filter(Boolean)
          .join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        {chat.loadingOlder && (
          <p className="db-dim db-center-text">Loading older messages…</p>
        )}

        {/* Connection wait state. Driven entirely by chat.connected, which
            the STOMP client sets in onConnect / onDisconnect / onStompError
            — no timer and no second connection check. It clears the moment
            the socket reports connected.

            Two presentations, same condition: with no history yet there is
            nothing to read, so it takes the space as a full card; once
            history has loaded it shrinks to a slim bar above the messages,
            which keeps the user informed that live updates aren't running
            yet without ever covering the conversation. */}
        {!chat.connected &&
          !chat.error &&
          (chat.messages.length ? (
            // Zero-height sticky wrapper: the bar floats over the top of
            // the conversation instead of pushing it down, and stays
            // pinned there while the user scrolls. No layout shift when
            // it appears or clears.
            <div className="db-chat-wait-float" aria-hidden={false}>
              <div
                className="db-chat-wait db-chat-wait--inline"
                role="status"
                aria-live="polite"
              >
                <span className="db-chat-wait-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="db-chat-wait-inline-txt">
                  Reconnecting to Support — live updates will resume shortly.
                </span>
              </div>
            </div>
          ) : (
            <div className="db-chat-wait" role="status" aria-live="polite">
              <span className="db-chat-wait-avatar" aria-hidden>
                <span className="db-chat-wait-ring" />
                <Headphones size={22} />
              </span>
              <p className="db-chat-wait-title">Connecting to Support</p>
              <p className="db-chat-wait-sub">
                Setting up a secure connection to our team.
              </p>
              <span className="db-chat-wait-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            </div>
          ))}

        {/* Placeholders only once connected — while pending, the block
            above already says what's happening, so they'd just stack. */}
        {(chat.connected || chat.error) && (
          <>
            {chat.loading && (
              <p className="db-dim db-center-text">Loading conversation…</p>
            )}
            {!chat.loading && !chat.messages.length && (
              /* Empty-state support card. Gated on the real message
                 state (`!chat.messages.length`) — the moment the first
                 message arrives or is sent, this unmounts and the
                 normal conversation renders. No timer involved. */
              <div className="db-chat-help">
                <span className="db-chat-help-icon" aria-hidden>
                  <Headphones size={22} />
                </span>

                <h3 className="db-chat-help-title">Need Help? Get in Touch</h3>
                <p className="db-chat-help-sub">
                  Send a message below, or for faster communication text or
                  message us about your order.
                </p>

                <div className="db-chat-help-actions">
                  <a
                    className="db-chat-help-btn is-text"
                    href="sms:+18175071278"
                    aria-label="Text us on +1 (817) 507-1278"
                  >
                    <MessageSquare size={16} aria-hidden />
                    <span className="db-chat-help-btn-label">Text Us</span>
                    <span className="db-chat-help-btn-num">
                      +1 (817) 507-1278
                    </span>
                  </a>

                  <a
                    className="db-chat-help-btn is-wa"
                    href="https://wa.me/15818096586"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Message us on WhatsApp at +1 (581) 809-6586"
                  >
                    {/* Same glyph as the site header — lucide has no
                        WhatsApp brand icon. */}
                    <svg viewBox="0 0 32 32" aria-hidden>
                      <path d={WA_GLYPH} />
                    </svg>
                    <span className="db-chat-help-btn-label">WhatsApp Us</span>
                    <span className="db-chat-help-btn-num">
                      +1 (581) 809-6586
                    </span>
                  </a>
                </div>

                <p className="db-chat-help-note">
                  We&apos;re available to assist you with any questions or
                  updates regarding your order.
                </p>
              </div>
            )}
          </>
        )}

        {chat.error && <p className="db-fail db-center-text">{chat.error}</p>}

        {chat.messages.map((m) => {
          const mine = String(m.senderId) === String(chat.userId);
          const label = dayFlags.get(m.messageId);
          const showDay = Boolean(label);
          const isImage = m.messageType === "IMAGE" && m.fileUrl;
          return (
            <div key={m.messageId}>
              {showDay && <p className="db-chat-day">{label}</p>}
              <div
                className={["db-chat-row", mine ? "mine" : "theirs"].join(" ")}
              >
                <div className="db-chat-bubble">
                  {m.replyToMessageId && (
                    <span className="db-chat-quote">
                      <span className="db-chat-quote-name">
                        {m.replySenderName ?? ""}
                      </span>
                      <span className="db-dim">
                        {m.replyMessage ?? "Attachment"}
                      </span>
                    </span>
                  )}
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="db-chat-img"
                      src={m.fileUrl}
                      alt=""
                      onClick={() => setLightbox(m.fileUrl!)}
                    />
                  ) : m.fileUrl ? (
                    <a
                      className="db-chat-file"
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Paperclip size={15} aria-hidden />
                      <span>
                        <span className="db-file-name">
                          {m.fileName ?? "File"}
                        </span>
                        <span className="db-dim">
                          {formatBytes(m.fileSize)}
                        </span>
                      </span>
                    </a>
                  ) : null}
                  {m.message && (
                    <span className="db-chat-text">{m.message}</span>
                  )}
                  <span className="db-chat-meta">
                    {clock(m.createdAt)}
                    {mine && (m.seen ? " ✓✓" : m.delivered ? " ✓✓" : " ✓")}
                  </span>
                  <button
                    type="button"
                    className="db-chat-reply"
                    onClick={() => setReplyTo(m)}
                    aria-label="Reply to this message"
                  >
                    <CornerUpLeft size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {chat.typing && (
        <p className="db-chat-typing" aria-live="polite">
          Support Team is typing…
        </p>
      )}

      {replyTo && (
        <div className="db-chat-replybar">
          <span className="db-dim">
            Replying to:{" "}
            {replyTo.message?.slice(0, 48) || replyTo.fileName || "Attachment"}
          </span>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            aria-label="Cancel reply"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {queue.length > 0 && (
        <ul className="db-chat-queue">
          {queue.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span className="db-file-name">{f.name}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => setQueue((p) => p.filter((_, x) => x !== i))}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="db-chat-input" ref={composerRef}>
        <button
          type="button"
          className="db-chat-icon"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a file"
        >
          <Paperclip size={17} />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <label htmlFor="chat-text" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-text"
          rows={1}
          className="db-chat-text-input"
          placeholder={chat.connected ? "Type a message…" : "Connecting…"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            chat.sendTyping(true, currentStudentName());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="button"
          className="db-chat-send"
          onClick={submit}
          disabled={!chat.connected}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      {lightbox && (
        <div
          className="db-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="db-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close image"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
  );
}

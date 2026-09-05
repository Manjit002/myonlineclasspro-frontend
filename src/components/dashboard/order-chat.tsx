"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, X, CornerUpLeft } from "lucide-react";
import { useOrderChat } from "@/hooks/use-order-chat";
import { formatBytes } from "@/lib/api-client";
import type { ChatMessage } from "@/types/dashboard";

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
        className={["db-chat-body", drag && "is-drag"]
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
        {chat.loading && (
          <p className="db-dim db-center-text">Loading conversation…</p>
        )}
        {chat.error && <p className="db-fail db-center-text">{chat.error}</p>}
        {!chat.loading && !chat.messages.length && (
          <p className="db-dim db-center-text">
            No messages yet. Send a message to reach our Support Team.
          </p>
        )}

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

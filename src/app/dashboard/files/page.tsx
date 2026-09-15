"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, X, Download, Eye } from "lucide-react";
import { Card, Spinner, Empty, Alert } from "@/components/dashboard/ui";
import { Modal } from "@/components/ui/modal";
import {
  getOrders,
  getOrderFiles,
  getFileCount,
  uploadFiles,
  getDownloadUrl,
  getPreviewUrl,
  MAX_FILE_BYTES,
} from "@/services/student-service";
import { formatBytes, formatDate } from "@/lib/api-client";
import type { OrderSummary, StudentFile } from "@/types/dashboard";

const CATEGORIES = [
  "",
  "ASSIGNMENT",
  "SYLLABUS",
  "RUBRIC",
  "SUBMISSION",
  "REFERENCE",
  "OTHER",
];
const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

export default function FilesPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [orderId, setOrderId] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<StudentFile[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [queue, setQueue] = useState<File[]>([]);
  const [msg, setMsg] = useState<{ k: "error" | "success"; t: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{
    name: string;
    url: string;
    ext: string;
  } | null>(null);

  useEffect(() => {
    getOrders(0, 100).then((r) => {
      if (r.ok) setOrders(r.data?.content ?? []);
    });
  }, []);

  const loadFiles = useCallback(async () => {
    if (!orderId) return;
    const r = await getOrderFiles(orderId, page);
    if (!r.ok) {
      setMsg({ k: "error", t: r.error });
      setFiles([]);
      return;
    }
    setFiles(r.data?.content ?? []);
    setTotalPages(r.data?.totalPages ?? 1);
    const c = await getFileCount(orderId);
    if (c.ok) {
      const v = typeof c.data === "number" ? c.data : (c.data?.count ?? 0);
      setCount(v);
    }
  }, [orderId, page]);

  useEffect(() => {
    // Wrapped so the first statement is an await — the effect body
    // itself never calls setState synchronously.
    void (async () => {
      await loadFiles();
    })();
  }, [loadFiles]);

  const addToQueue = (list: FileList | null) => {
    if (!list) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      // 100 MB ceiling, matching the original and the backend.
      if (f.size > MAX_FILE_BYTES) {
        setMsg({ k: "error", t: `${f.name} exceeds the 100 MB limit.` });
        continue;
      }
      next.push(f);
    }
    if (next.length) setQueue((p) => [...p, ...next]);
  };

  async function doUpload() {
    if (!orderId) {
      setMsg({ k: "error", t: "Select an order first." });
      return;
    }
    if (!queue.length) {
      setMsg({ k: "error", t: "Add at least one file." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const r = await uploadFiles(orderId, category, queue);
    setBusy(false);
    if (!r.ok) {
      setMsg({ k: "error", t: r.error });
      return;
    }
    setMsg({ k: "success", t: `${queue.length} file(s) uploaded.` });
    setQueue([]);
    await loadFiles();
  }

  async function doDownload(f: StudentFile) {
    const r = await getDownloadUrl(f.id);
    const url = r.ok ? (r.data?.downloadUrl ?? r.data?.url) : null;
    if (!url) {
      setMsg({ k: "error", t: "Could not get download link." });
      return;
    }
    // Backend returns a URL (often pre-signed) — use it rather than assuming
    // the file is directly reachable.
    const a = document.createElement("a");
    a.href = url;
    a.download = f.fileName ?? "file";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function doPreview(f: StudentFile) {
    const ext = (f.fileName ?? "").split(".").pop()?.toLowerCase() ?? "";
    const r = await getPreviewUrl(f.id);
    const url = r.ok ? (r.data?.previewUrl ?? r.data?.url ?? "") : "";
    setPreview({ name: f.fileName ?? "Preview", url, ext });
  }

  return (
    <>
      <div className="db-files-toolbar">
        <label htmlFor="f-order" className="sr-only">
          Select order
        </label>
        <select
          id="f-order"
          className="db-input"
          value={orderId}
          onChange={(e) => {
            setFiles(null);
            setCount(null);
            setOrderId(e.target.value);
            setPage(0);
          }}
        >
          <option value="">— Select an Order —</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              OD-{o.id} — {o.subject ?? ""}
            </option>
          ))}
        </select>
        <label htmlFor="f-cat" className="sr-only">
          Category
        </label>
        <select
          id="f-cat"
          className="db-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c || "All Categories"}
            </option>
          ))}
        </select>
        {count != null && (
          <span className="db-dim">
            {count} file{count === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {msg && <Alert kind={msg.k}>{msg.t}</Alert>}

      {orderId && (
        <Card title="Upload Files">
          <div
            className={["db-drop", drag && "is-drag"].filter(Boolean).join(" ")}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              addToQueue(e.dataTransfer.files);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <Paperclip size={20} aria-hidden />
            <span>Click or drag files here — max 100 MB each</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              addToQueue(e.target.files);
              e.target.value = "";
            }}
          />

          {queue.length > 0 && (
            <ul className="db-file-list">
              {queue.map((f, i) => (
                <li key={`${f.name}-${i}`}>
                  <span className="db-file-name">{f.name}</span>
                  <span className="db-dim">{formatBytes(f.size)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setQueue((p) => p.filter((_, x) => x !== i))}
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="db-btn-gold"
            onClick={doUpload}
            disabled={busy}
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </Card>
      )}

      {!orderId && (
        <Empty
          icon="📁"
          title="Select an order"
          sub="Choose an order above to view its files."
        />
      )}
      {orderId && !files && (
        <div className="db-center">
          <Spinner />
        </div>
      )}
      {files?.length === 0 && (
        <Empty
          icon="📁"
          title="No files found"
          sub="Nothing uploaded for this order yet."
        />
      )}

      {files && files.length > 0 && (
        <>
          <div className="db-files-grid">
            {files.map((f) => (
              <article key={f.id} className="db-file-card">
                <p className="db-fc-name" title={f.fileName}>
                  {f.fileName ?? "—"}
                </p>
                <p className="db-dim">
                  {formatBytes(f.fileSize)}
                  {f.uploadedAt ? ` · ${formatDate(f.uploadedAt)}` : ""}
                </p>
                {f.category && <span className="db-fc-cat">{f.category}</span>}
                <div className="db-fc-actions">
                  <button type="button" onClick={() => doPreview(f)}>
                    <Eye size={13} aria-hidden /> Preview
                  </button>
                  <button type="button" onClick={() => doDownload(f)}>
                    <Download size={13} aria-hidden /> Download
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="db-pagination">
            <span className="db-dim">
              Page {page + 1} of {totalPages}
            </span>
            <span className="db-pg-btns">
              <button
                type="button"
                className="db-pg"
                disabled={page === 0}
                onClick={() => {
                  setFiles(null);
                  setPage((p) => p - 1);
                }}
              >
                Prev
              </button>
              <button
                type="button"
                className="db-pg"
                disabled={page >= totalPages - 1}
                onClick={() => {
                  setFiles(null);
                  setPage((p) => p + 1);
                }}
              >
                Next
              </button>
            </span>
          </div>
        </>
      )}

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview?.name ?? ""}
      >
        {preview && preview.url && IMAGE_EXT.includes(preview.ext) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.url}
            alt=""
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        )}
        {preview && preview.url && preview.ext === "pdf" && (
          <iframe
            src={preview.url}
            title={preview.name}
            style={{
              width: "100%",
              height: "60vh",
              border: "none",
              borderRadius: 8,
            }}
          />
        )}
        {preview &&
          (!preview.url ||
            (!IMAGE_EXT.includes(preview.ext) && preview.ext !== "pdf")) && (
            <p className="db-dim">
              Preview isn&apos;t available for this file type. Use Download
              instead.
            </p>
          )}
      </Modal>
    </>
  );
}

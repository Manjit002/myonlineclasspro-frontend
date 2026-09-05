"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, X, Rocket } from "lucide-react";
import { Card, Alert } from "@/components/dashboard/ui";
import { placeOrder } from "@/services/student-service";
import { formatBytes } from "@/lib/api-client";

const TYPES = [
  "Full Online Class",
  "Online Exam",
  "Assignment / Essay",
  "Discussion Post",
  "Homework",
  "Dissertation",
  "Quiz",
  "Research Paper",
  "Case Study",
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per attachment, as the original enforced

function localMin() {
  const d = new Date(Date.now() + 3600000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function PlaceOrderPage() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [instructions, setInstructions] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const words = instructions.trim()
    ? instructions.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_BYTES) {
        setFormErr(`${f.name} exceeds the 10 MB limit.`);
        continue;
      }
      next.push(f);
    }
    if (next.length) setFiles((p) => [...p, ...next]);
  };

  async function submit() {
    const e: Record<string, string> = {};
    if (!type) e.type = "Required";
    if (!subject.trim()) e.subject = "Required";
    if (!deadline || new Date(deadline) <= new Date())
      e.deadline = "Set a future deadline";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    setFormErr(null);
    setOkMsg(null);
    const r = await placeOrder({
      subject,
      assignmentType: type,
      deadline,
      instructions,
      files,
    });
    setBusy(false);
    if (!r.ok) {
      setFormErr(r.error);
      return;
    }
    setOkMsg(`Order OD-${r.data?.id} placed. Redirecting…`);
    setFiles([]);
    setTimeout(() => router.push("/dashboard/orders"), 1500);
  }

  return (
    <Card title="Place New Order">
      {formErr && <Alert kind="error">{formErr}</Alert>}
      {okMsg && <Alert kind="success">{okMsg}</Alert>}

      <div className="db-form-row">
        <div className="db-field">
          <label htmlFor="po-type">Assignment Type *</label>
          <select
            id="po-type"
            className="db-input"
            value={type}
            aria-invalid={Boolean(errors.type)}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">— Select —</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && <p className="db-field-err">{errors.type}</p>}
        </div>
        <div className="db-field">
          <label htmlFor="po-subject">Subject Area *</label>
          <input
            id="po-subject"
            className="db-input"
            value={subject}
            placeholder="e.g. Nursing, Computer Science…"
            aria-invalid={Boolean(errors.subject)}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && <p className="db-field-err">{errors.subject}</p>}
        </div>
      </div>

      <div className="db-field">
        <label htmlFor="po-deadline">Deadline *</label>
        <input
          id="po-deadline"
          type="datetime-local"
          className="db-input"
          min={localMin()}
          value={deadline}
          aria-invalid={Boolean(errors.deadline)}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {errors.deadline && <p className="db-field-err">{errors.deadline}</p>}
      </div>

      <div className="db-field">
        <label htmlFor="po-instructions">
          Special Instructions <span className="db-dim">({words} words)</span>
        </label>
        <textarea
          id="po-instructions"
          className="db-input"
          rows={4}
          placeholder="Rubric, LMS details, any notes…"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div className="db-field">
        <span className="db-field-label">Attachments (optional)</span>
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
            addFiles(e.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <Paperclip size={20} aria-hidden />
          <span>Click or drag files here</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.zip"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {files.length > 0 && (
          <ul className="db-file-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span className="db-file-name">{f.name}</span>
                <span className="db-dim">{formatBytes(f.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((p) => p.filter((_, x) => x !== i))}
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="db-btn-gold db-btn-block"
        onClick={submit}
        disabled={busy}
      >
        <Rocket size={16} aria-hidden /> {busy ? "Submitting…" : "Submit Order"}
      </button>
    </Card>
  );
}

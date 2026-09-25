"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, Skeleton, Alert } from "@/components/dashboard/ui";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/services/student-service";
import { formatDate } from "@/lib/api-client";
import type { StudentProfile } from "@/types/dashboard";

export default function ProfilePage() {
  const [p, setP] = useState<StudentProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [msg, setMsg] = useState<{ k: "error" | "success"; t: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{
    k: "error" | "success";
    t: string;
  } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await getProfile();
    if (!r.ok) {
      setMsg({ k: "error", t: r.error });
      return;
    }
    setP(r.data);
    setName(r.data?.name ?? "");
    setPhone(r.data?.phone ?? "");
    setCountry(r.data?.country ?? "");
  }, []);

  useEffect(() => {
    // Wrapped so the first statement is an await — the effect body
    // itself never calls setState synchronously.
    void (async () => {
      await load();
    })();
  }, [load]);

  async function save() {
    setBusy(true);
    setMsg(null);
    const r = await updateProfile({
      name: name.trim() || null,
      phone: phone.trim() || null,
      country: country.trim() || null,
    });
    setBusy(false);
    if (!r.ok) {
      setMsg({ k: "error", t: r.error });
      return;
    }
    setMsg({ k: "success", t: "Profile updated successfully." });
    setEditing(false);
    // Refresh so the sidebar and topbar pick up the new name/email.
    await load();
  }

  async function submitPassword() {
    setPwMsg(null);
    if (!oldPw) {
      setPwMsg({ k: "error", t: "Current password is required." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({
        k: "error",
        t: "New password must be at least 6 characters.",
      });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ k: "error", t: "Passwords do not match." });
      return;
    }
    setPwBusy(true);
    const r = await changePassword(oldPw, newPw);
    setPwBusy(false);
    if (!r.ok) {
      setPwMsg({ k: "error", t: r.error });
      return;
    }
    setPwMsg({ k: "success", t: "Password updated successfully." });
    setOldPw("");
    setNewPw("");
    setConfirmPw("");
  }

  const rows: [string, string][] = p
    ? [
        ["Name", p.name || "—"],
        ["Email", p.email || "—"],
        ["Phone", p.phone || "—"],
        ["Country", p.country || "—"],
        ["Status", p.availabilityStatus || (p.online ? "Online" : "Offline")],
        ["Verified", p.verified ? "Verified" : "Not Verified"],
        ["Student ID", p.id ? `ID-${p.id}` : "—"],
        ["Member Since", formatDate(p.createdAt)],
      ]
    : [];

  return (
    <div className="db-two-col">
      <Card
        title="My Profile"
        action={
          <button
            type="button"
            className="db-link-btn"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        }
      >
        {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
        {!p && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton mb={0} />
          </>
        )}

        {p && !editing && (
          <dl className="db-info-list">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {p && editing && (
          <>
            <div className="db-field">
              <label htmlFor="pe-name">Full Name</label>
              <input
                id="pe-name"
                className="db-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="db-field">
              <label htmlFor="pe-phone">Phone</label>
              <input
                id="pe-phone"
                className="db-input"
                value={phone}
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="db-field">
              <label htmlFor="pe-country">Country</label>
              <input
                id="pe-country"
                className="db-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
              />
            </div>
            <button
              type="button"
              className="db-btn-gold"
              onClick={save}
              disabled={busy}
            >
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </>
        )}
      </Card>

      <Card title="Change Password">
        {pwMsg && <Alert kind={pwMsg.k}>{pwMsg.t}</Alert>}
        <div className="db-field">
          <label htmlFor="cp-old">Current Password</label>
          <input
            id="cp-old"
            type="password"
            className="db-input"
            value={oldPw}
            autoComplete="current-password"
            onChange={(e) => setOldPw(e.target.value)}
          />
        </div>
        <div className="db-field">
          <label htmlFor="cp-new">New Password</label>
          <input
            id="cp-new"
            type="password"
            className="db-input"
            value={newPw}
            placeholder="Min 6 characters"
            autoComplete="new-password"
            onChange={(e) => setNewPw(e.target.value)}
          />
        </div>
        <div className="db-field">
          <label htmlFor="cp-confirm">Confirm New Password</label>
          <input
            id="cp-confirm"
            type="password"
            className="db-input"
            value={confirmPw}
            autoComplete="new-password"
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="db-btn-gold"
          onClick={submitPassword}
          disabled={pwBusy}
        >
          {pwBusy ? "Updating…" : "Update Password"}
        </button>
      </Card>
    </div>
  );
}

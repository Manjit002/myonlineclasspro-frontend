"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  verifySession,
  loginWithOtp,
  loginWithPassword,
  sendOtp,
  storeSession,
} from "@/services/auth-service";
import { validateEmail } from "@/lib/validation";
import { DASHBOARD_ROUTE, clearSession, getToken } from "@/lib/api-client";

type Tab = "password" | "otp";

export function LoginForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1 && timer.current) clearInterval(timer.current);
        return s - 1;
      });
    }, 1000);
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setError(null);
    setNotice(null);
  };

  const succeed = async () => {
    setNotice("Login successful. Redirecting…");
    // Prove the backend accepts the token before handing over, so a bad
    // session can't drop the person into an empty dashboard.
    const token = getToken();
    if (!token || !(await verifySession(token))) {
      clearSession();
      setNotice(null);
      setError("We could not verify your session. Please try again.");
      return;
    }
    // The dashboard is a Next.js route — never the old server-rendered
    // one on the API origin. `replace` so Back doesn't return to login.
    router.replace(DASHBOARD_ROUTE);
  };

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const emailErr = validateEmail(email);
    if (emailErr) return setError(emailErr);
    if (!password) return setError("Password is required.");

    setBusy(true);
    const r = await loginWithPassword(email.trim(), password);
    setBusy(false);
    if (!r.ok) return setError(r.error);
    if (!r.data.accessToken)
      return setError("Login failed — no token returned.");
    storeSession(r.data, email.trim());
    succeed();
  }

  async function onSendOtp() {
    setError(null);
    setNotice(null);
    const emailErr = validateEmail(email);
    if (emailErr) return setError(emailErr);

    setBusy(true);
    const r = await sendOtp(email.trim());
    setBusy(false);
    if (!r.ok) return setError(r.error);
    setOtpSent(true);
    setNotice(`OTP sent to ${email.trim()}`);
    startCooldown(60);
  }

  async function onOtpLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp || otp.length < 4)
      return setError("Enter the OTP sent to your email.");

    setBusy(true);
    const r = await loginWithOtp(email.trim(), otp.trim());
    setBusy(false);
    if (!r.ok) return setError(r.error);
    if (!r.data.accessToken)
      return setError("Login failed — no token returned.");
    storeSession(r.data, email.trim());
    succeed();
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Student Login</h1>
      <p className="auth-sub">
        Access your orders, track progress, and communicate with your expert.
      </p>

      <div
        className="auth-tabs"
        data-active={tab}
        role="tablist"
        aria-label="Login method"
      >
        {(["password", "otp"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={["auth-tab", tab === t && "is-active"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => switchTab(t)}
          >
            {t === "password" ? "Password Login" : "OTP Login"}
          </button>
        ))}
      </div>

      {error && (
        <p className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={16} aria-hidden />
          {error}
        </p>
      )}
      {notice && (
        <p className="auth-alert auth-alert-ok" role="status">
          <Check size={16} aria-hidden />
          {notice}
        </p>
      )}

      {tab === "password" ? (
        <form onSubmit={onPasswordLogin} noValidate>
          <div className="auth-field">
            <label htmlFor="lg-email">Email Address</label>
            <input
              id="lg-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="lg-pw">Password</label>
            <div className="auth-pw">
              <input
                id="lg-pw"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-pw-eye"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Login to My Account"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={onOtpLogin} noValidate>
          <div className="auth-field">
            <label htmlFor="lg-otp-email">Email Address</label>
            <div className="auth-otp-row">
              <input
                id="lg-otp-email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                className="auth-otp-send"
                onClick={onSendOtp}
                disabled={busy || cooldown > 0}
              >
                {cooldown > 0 ? `Resend ${cooldown}s` : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="auth-field">
              <label htmlFor="lg-otp">Enter OTP</label>
              <input
                id="lg-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                className="auth-otp-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          )}

          {otpSent && (
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Verifying…
                </>
              ) : (
                "Verify & Login"
              )}
            </button>
          )}
        </form>
      )}

      <p className="auth-foot">
        New here? <Link href="/signup">Create an Account</Link>
        {" · "}
        <Link href="/place-order">Place an Order</Link>
      </p>
    </div>
  );
}

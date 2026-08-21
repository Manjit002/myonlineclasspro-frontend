"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  verifySession,
  registerStudent,
  storeSession,
} from "@/services/auth-service";
import { validateEmail } from "@/lib/validation";
import type { RegisterPayload } from "@/types/auth";
import { DASHBOARD_ROUTE, clearSession, getToken } from "@/lib/api-client";
import { cn } from "@/lib/utils";

/**
 * Student registration, mirroring the two-step flow of the existing
 * Spring Boot signup page (Account -> Details).
 *
 * Reuses this project's auth service, validation helpers, icon set and
 * theme tokens — it does not introduce a second API client, a second
 * theme, or its own layout. The shared Navbar/Footer come from the root
 * layout automatically, so this renders as a native page of the site.
 */

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Germany",
  "France",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Philippines",
  "Bangladesh",
  "Other",
];

const LEVELS = [
  { value: "HIGH_SCHOOL", label: "High School" },
  { value: "ASSOCIATE", label: "Associate's Degree" },
  { value: "BACHELOR", label: "Bachelor's Degree" },
  { value: "MASTER", label: "Master's Degree" },
  { value: "PHD", label: "PhD / Doctorate" },
  { value: "PROFESSIONAL", label: "Professional Certificate" },
  { value: "OTHER", label: "Other" },
];

type Errors = Partial<Record<string, string>>;

/** Mirrors the original page's 5-point scoring. */
function strengthOf(pw: string) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { pct: 20, label: "Weak", tone: "var(--danger)" },
    { pct: 40, label: "Fair", tone: "#ff6b35" },
    { pct: 60, label: "Good", tone: "#ffa502" },
    { pct: 80, label: "Strong", tone: "#7bed9f" },
    { pct: 100, label: "Very Strong", tone: "var(--green)" },
  ];
  return levels[Math.max(0, score - 1)];
}

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [university, setUniversity] = useState("");

  const strength = strengthOf(password);

  const clear = (k: string) =>
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  const validateAccount = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (validateEmail(email)) next.email = "Enter a valid email address.";
    if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateDetails = () => {
    const next: Errors = {};
    if (!country) next.country = "Please select your country.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit() {
    if (!validateDetails()) return;
    // Re-check step 1 so a user can't submit with stale invalid data.
    if (!validateAccount()) {
      setStep(0);
      return;
    }

    setBusy(true);
    setFormError(null);

    const payload: RegisterPayload = {
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || null,
      country,
      academicLevel: level || undefined,
      university: university.trim() || null,
    };

    const result = await registerStudent(payload);
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    storeSession(result.data, email.trim());

    // Same verification the login and guest-order flows use.
    const token = getToken();
    if (!token || !(await verifySession(token))) {
      clearSession();
      setFormError(
        "Your account was created, but we could not sign you in automatically. Please log in.",
      );
      return;
    }
    setDone(true);
    // Next.js dashboard route, not the old server-rendered dashboard.
    router.replace(DASHBOARD_ROUTE);
  }

  if (done) {
    return (
      <div className="auth-card auth-done" role="status">
        <span className="auth-done-icon" aria-hidden>
          <Check size={28} />
        </span>
        <h1 className="auth-title">Welcome aboard</h1>
        <p className="auth-sub">
          Your account has been created. Taking you to your dashboard…
        </p>
        <Link className="auth-submit" href={DASHBOARD_ROUTE}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">
        {step === 0 ? "Create Your Account" : "Your Details"}
      </h1>
      <p className="auth-sub">
        {step === 0
          ? "Join thousands of students who trust MyOnlineClassPro."
          : "Almost done — just a couple more details."}
      </p>

      <ol className="auth-steps" aria-label="Progress">
        {["Account", "Details"].map((label, i) => (
          <li key={label}>
            <span
              className={cn(
                "auth-step-dot",
                i === step && "is-active",
                i < step && "is-done",
              )}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </span>
            <span
              className={cn("auth-step-label", i === step && "is-active")}
              aria-current={i === step ? "step" : undefined}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {formError && (
        <p className="auth-alert" role="alert">
          <AlertCircle size={16} aria-hidden />
          {formError}
        </p>
      )}

      {step === 0 && (
        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="su-name">Full Name</label>
            <input
              id="su-name"
              value={name}
              autoComplete="name"
              placeholder="John Smith"
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => {
                setName(e.target.value);
                clear("name");
              }}
            />
            {errors.name && <p className="auth-err">{errors.name}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="su-email">Email Address</label>
            <input
              id="su-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => {
                setEmail(e.target.value);
                clear("email");
              }}
            />
            {errors.email && <p className="auth-err">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="su-pw">Password</label>
            <div className="auth-pw">
              <input
                id="su-pw"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={password}
                aria-invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clear("password");
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div className="auth-strength">
                <span className="auth-strength-track">
                  <span
                    className="auth-strength-fill"
                    style={{
                      width: `${strength.pct}%`,
                      background: strength.tone,
                    }}
                  />
                </span>
                <span style={{ color: strength.tone }}>{strength.label}</span>
              </div>
            )}
            {errors.password && <p className="auth-err">{errors.password}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="su-confirm">Confirm Password</label>
            <div className="auth-pw">
              <input
                id="su-confirm"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                aria-invalid={Boolean(errors.confirm)}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  clear("confirm");
                }}
              />
            </div>
            {errors.confirm && <p className="auth-err">{errors.confirm}</p>}
          </div>

          <button
            type="button"
            className="auth-submit"
            onClick={() => validateAccount() && setStep(1)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="auth-fields">
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="su-phone">
                Phone <span className="auth-optional">(optional)</span>
              </label>
              <input
                id="su-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="su-country">Country</label>
              <select
                id="su-country"
                value={country}
                aria-invalid={Boolean(errors.country)}
                onChange={(e) => {
                  setCountry(e.target.value);
                  clear("country");
                }}
              >
                <option value="">— Select country —</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && <p className="auth-err">{errors.country}</p>}
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="su-level">
              Academic Level <span className="auth-optional">(optional)</span>
            </label>
            <select
              id="su-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">— Select level —</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="su-uni">
              University / Institution{" "}
              <span className="auth-optional">(optional)</span>
            </label>
            <input
              id="su-uni"
              autoComplete="organization"
              placeholder="e.g. University of Florida"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="auth-submit"
            onClick={handleSubmit}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Creating account…
              </>
            ) : (
              "Create My Account"
            )}
          </button>
          <button
            type="button"
            className="auth-secondary"
            onClick={() => setStep(0)}
            disabled={busy}
          >
            Back
          </button>
        </div>
      )}

      <p className="auth-foot">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}

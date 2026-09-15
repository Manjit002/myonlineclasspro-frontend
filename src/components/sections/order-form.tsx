"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { PhoneField } from "@/components/ui/phone-field";
import {
  validateEmail,
  validateName,
  validatePhone,
  type OrderFormErrors,
  type OrderFormValues,
} from "@/lib/validation";
import {
  createGuestOrderV2,
  verifySession,
  DEADLINE_VALUES,
} from "@/services/guest-order-service";
import { storeSession } from "@/services/auth-service";
import { clearSession } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { SERVICE_PRICES } from "@/constants/pricing";

/* Prices and labels come from the shared pricing source, so this form
   and the homepage Pricing section can never show different numbers.
   The label is also the exact assignmentType value /orders/guest/v2
   expects ("Full Class" | "Assignment" | "Exam" | "Quiz"). */
const SERVICES = SERVICE_PRICES;

type Service = (typeof SERVICE_PRICES)[number];

/* `value` is the exact lowercase string the backend accepts; the label
   stays capitalised for display. The backend derives the real date from
   this key, so no date is calculated here. */
const DEADLINES = [
  {
    id: "LONGER",
    label: "Longer",
    range: "30–60 days",
    value: DEADLINE_VALUES.LONGER,
  },
  {
    id: "REGULAR",
    label: "Regular",
    range: "15–30 days",
    value: DEADLINE_VALUES.REGULAR,
  },
  {
    id: "STANDARD",
    label: "Standard",
    range: "7–10 days",
    value: DEADLINE_VALUES.STANDARD,
  },
  {
    id: "URGENT",
    label: "Urgent",
    range: "2–5 days",
    value: DEADLINE_VALUES.URGENT,
  },
] as const;

/* Two phases are still tracked internally — the visible "Step 1 / Step 2"
   indicator is gone, so the form reads as one compact card that reveals
   contact fields on submit. */
const STEP_COUNT = 2;

const EMPTY: OrderFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  assignmentType: "",
  deadline: "",
  instructions: "",
};

const getService = (id: string) => SERVICES.find((s) => s.id === id);
const getDeadline = (id: string) => DEADLINES.find((d) => d.id === id);

const inputBase = [
  "h-12 w-full rounded-xl border bg-bg-2 px-4",
  "text-text-primary outline-none transition",
  "placeholder:text-text-muted",
  "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
  // 16px stops iOS Safari zooming the page on focus.
  "text-base sm:text-sm",
].join(" ");

export function OrderForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<OrderFormValues>(EMPTY);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  /* State updates are async, so three clicks inside one tick all read
     `submitting === false` and each fire a request. A ref flips
     synchronously, so only the first click gets through. */
  const inFlight = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsFor, setTermsFor] = useState<Service | null>(null);

  const selectedService = getService(values.assignmentType);
  const price = selectedService?.price ?? 0;

  // Roving focus for the service radiogroup.
  const serviceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onServiceKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const next =
      (index + (forward ? 1 : -1) + SERVICES.length) % SERVICES.length;
    set("assignmentType", SERVICES[next].id);
    serviceRefs.current[next]?.focus();
  };

  const set = <K extends keyof OrderFormValues>(
    key: K,
    value: OrderFormValues[K],
  ) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setSubmitError(null);
  };

  const validateOrderStep = () => {
    const next: OrderFormErrors = {};
    if (!values.assignmentType)
      next.assignmentType = "Please choose a service.";
    if (!values.deadline) next.deadline = "Please choose a deadline.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateContactStep = () => {
    const next: OrderFormErrors = {};
    // Subject lives on this step, so it is validated here rather than
    // with the service/deadline choices on the previous one.
    if (!values.subject.trim()) next.subject = "Please enter your subject.";
    const n = validateName(values.fullName);
    const e = validateEmail(values.email);
    const ph = validatePhone(values.phone);
    if (n) next.fullName = n;
    if (e) next.email = e;
    if (ph) next.phone = ph;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (step === 0 && !validateOrderStep()) return;
    setErrors({});
    setSubmitError(null);
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  };

  // Values live in state, so stepping back never loses the service,
  // deadline, price or anything already typed.
  const goBack = () => {
    setErrors({});
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  async function handleSubmit() {
    // Guard against a double-click racing a second order through.
    if (inFlight.current) return;
    if (!validateContactStep()) return;

    const service = getService(values.assignmentType);
    const deadline = getDeadline(values.deadline);
    if (!service || !deadline) {
      setStep(0);
      validateOrderStep();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);

    // Exactly the six fields of GuestOrderV2RequestDTO — no price, no
    // files, no IP/country, no Authorization header.
    const result = await createGuestOrderV2({
      assignmentType: service.label,
      subject: values.subject.trim(),
      deadline: deadline.value,
      name: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    });

    if (!result.ok) {
      inFlight.current = false;
      setSubmitting(false);
      setSubmitError(result.error);
      return;
    }

    // Reuse the app's existing session storage rather than a second
    // auth mechanism, so the dashboard reads the token as usual.
    storeSession(
      {
        accessToken: result.data.token,
        userId: result.data.studentId,
        role: "STUDENT",
      },
      values.email.trim(),
    );

    // A JWT can't be cryptographically verified in the browser, so prove
    // the backend accepts it before handing the person to the dashboard.
    const valid = await verifySession(result.data.token);
    if (!valid) {
      clearSession();
      inFlight.current = false;
      setSubmitting(false);
      setSubmitError(
        "We created your order, but could not sign you in automatically. Please log in to view it.",
      );
      return;
    }

    // The token stays in storage — never in the URL. Only the order id is
    // in the path, which is the dashboard's existing way of opening one.
    // `replace` so Back doesn't return to the submitted form.
    router.replace(`/dashboard/orders/${result.data.orderId}`);
  }

  return (
    <>
      <div className="border-border bg-bg-1 overflow-hidden rounded-[22px] border shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="card-h text-text-primary">Free Instant Quote</h2>
              <p className="text-text-muted mt-0.5 text-xs">
                No login required. Expert assigned in 10 minutes.
              </p>
            </div>
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 sm:flex">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-4 sm:px-5 sm:py-5"
          >
            {step === 0 && (
              <div className="space-y-4">
                <fieldset>
                  <legend className="text-text-primary mb-2 text-sm font-semibold">
                    What do you need help with?
                    <span className="ml-1 text-red-500">*</span>
                  </legend>

                  <div
                    role="radiogroup"
                    aria-label="Service"
                    className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-1.5 sm:gap-2"
                  >
                    {SERVICES.map((service, index) => {
                      const selected = values.assignmentType === service.id;
                      // Roving tabindex: one stop for the whole group.
                      const tabbable =
                        selected || (!selectedService && index === 0);
                      return (
                        <div
                          key={service.id}
                          className={cn(
                            "relative min-h-[56px] rounded-xl border px-2.5 py-1.5 transition-all sm:px-3.5",
                            selected
                              ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_3px_rgba(99,102,241,0.07)]"
                              : "border-border bg-bg-2 hover:bg-bg-3/60 hover:border-indigo-400",
                          )}
                        >
                          {/* The overlay must sit ABOVE the content, not
                              below it, or the card text intercepts the click
                              and only the padding gaps are selectable. The
                              content is pointer-events-none so taps fall
                              through to this button; the T&C control opts
                              back in below. */}
                          <button
                            type="button"
                            ref={(el) => {
                              serviceRefs.current[index] = el;
                            }}
                            onClick={() => set("assignmentType", service.id)}
                            onKeyDown={(e) => onServiceKeyDown(e, index)}
                            role="radio"
                            aria-checked={selected}
                            tabIndex={tabbable ? 0 : -1}
                            aria-label={`${service.label}, $${service.price}`}
                            className="absolute inset-0 z-10 [touch-action:manipulation] rounded-xl"
                          />
                          {/* Two rows rather than three: the price now shares a
                              row with the T&C link. The stack was what set the
                              card's height floor — padding alone had no slack
                              left to give. All four elements are retained. */}
                          <div className="pointer-events-none relative z-20 flex h-full flex-col justify-center gap-0.5">
                            <div className="flex items-center justify-between gap-1.5">
                              <p className="text-text-primary min-w-0 truncate text-[15px] leading-5 font-semibold">
                                {service.label}
                              </p>
                              {selected && (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                  <Check size={10} />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-1.5">
                              <p className="text-text-muted text-xs leading-4">
                                ${service.price}
                              </p>
                              <button
                                type="button"
                                onClick={() => setTermsFor(service)}
                                className="pointer-events-auto relative z-30 inline-flex shrink-0 [touch-action:manipulation] items-center gap-1 text-[11px] font-semibold text-indigo-600 transition hover:text-indigo-800"
                              >
                                <FileText size={11} />T &amp; C
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.assignmentType && (
                    <p className="mt-2 text-xs text-red-500" role="alert">
                      {errors.assignmentType}
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="text-text-primary mb-2 text-sm font-semibold">
                    Deadline<span className="ml-1 text-red-500">*</span>
                  </legend>

                  <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-1.5 sm:gap-2">
                    {DEADLINES.map((d) => {
                      const selected = values.deadline === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => set("deadline", d.id)}
                          aria-pressed={selected}
                          className={cn(
                            "min-h-[70px] [touch-action:manipulation] rounded-xl border px-4 py-3 text-left transition-all",
                            selected
                              ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_3px_rgba(99,102,241,0.06)]"
                              : "border-border bg-bg-2 hover:border-indigo-400",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-text-primary text-sm font-semibold">
                              {d.label}
                            </span>
                            {selected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                                <Check size={12} />
                              </span>
                            )}
                          </span>
                          <span className="text-text-muted mt-1 block text-xs">
                            {d.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {errors.deadline && (
                    <p className="mt-2 text-xs text-red-500" role="alert">
                      {errors.deadline}
                    </p>
                  )}
                </fieldset>

                <div className="border-border border-t pt-5">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-text-muted text-sm">Estimated Total</p>
                      <p className="mt-0.5 flex items-baseline gap-2">
                        <span
                          aria-live="polite"
                          className="text-text-primary text-3xl font-extrabold tracking-tight"
                        >
                          ${price}
                        </span>
                        <span className="text-text-muted text-xs">
                          one-time
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={goNext}
                      className="btn-primary inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Order Now
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="text-text-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      Grade B guaranteed
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Lock size={13} className="text-emerald-500" />
                      Confidential
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="of-subject"
                    className="text-text-primary mb-2 block text-sm font-semibold"
                  >
                    Subject<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="of-subject"
                    type="text"
                    value={values.subject}
                    placeholder="e.g. Nursing, Computer Science…"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? "of-subject-err" : undefined
                    }
                    onChange={(e) => set("subject", e.target.value)}
                    className={cn(
                      inputBase,
                      errors.subject ? "border-red-400" : "border-border",
                    )}
                  />
                  {errors.subject && (
                    <p
                      id="of-subject-err"
                      className="mt-2 text-xs text-red-500"
                      role="alert"
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-text-primary text-lg font-bold">
                    Contact Details
                  </h3>
                  <p className="text-text-muted mt-1 text-sm">
                    Enter your details so we can contact you about your order.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="of-name"
                    className="text-text-primary mb-2 block text-sm font-semibold"
                  >
                    Name<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="of-name"
                    value={values.fullName}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-invalid={Boolean(errors.fullName)}
                    onChange={(e) => set("fullName", e.target.value)}
                    className={cn(
                      inputBase,
                      errors.fullName ? "border-red-400" : "border-border",
                    )}
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-xs text-red-500" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="of-phone"
                    className="text-text-primary mb-2 block text-sm font-semibold"
                  >
                    Phone Number<span className="ml-1 text-red-500">*</span>
                  </label>
                  {/* Stores one combined string, "<dial> <10 digits>", so
                      the existing `phone` field and API are unchanged. */}
                  <PhoneField
                    id="of-phone"
                    value={values.phone}
                    onChange={(v) => set("phone", v)}
                    invalid={Boolean(errors.phone)}
                    describedBy={errors.phone ? "of-phone-err" : undefined}
                    inputClassName={cn(
                      inputBase,
                      errors.phone ? "border-red-400" : "border-border",
                    )}
                  />
                  {errors.phone && (
                    <p
                      id="of-phone-err"
                      className="mt-2 text-xs text-red-500"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="of-email"
                    className="text-text-primary mb-2 block text-sm font-semibold"
                  >
                    Email Address<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="of-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    placeholder="Enter your email address"
                    aria-invalid={Boolean(errors.email)}
                    onChange={(e) => set("email", e.target.value)}
                    className={cn(
                      inputBase,
                      errors.email ? "border-red-400" : "border-border",
                    )}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500"
                  >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="border-border flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={submitting}
                    className="text-text-secondary hover:bg-bg-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:opacity-50"
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Creating your order…
                      </>
                    ) : (
                      <>
                        Get Quote
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reuses the shared Modal (focus trap, Escape, scroll lock) and links
          to the real terms route rather than restating legal text here. */}
      <Modal
        open={termsFor !== null}
        onClose={() => setTermsFor(null)}
        title={`${termsFor?.label ?? ""} — Terms & Conditions`}
      >
        <p className="text-text-secondary text-sm leading-6">
          Ordering <strong>{termsFor?.label}</strong> support at $
          {termsFor?.price} is covered by our standard service terms, including
          delivery, revisions, refunds and confidentiality.
        </p>
        <Link
          href="/legal/terms"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <FileText size={14} />
          Read the full Terms &amp; Conditions
        </Link>
        <button
          type="button"
          onClick={() => setTermsFor(null)}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Close
        </button>
      </Modal>
    </>
  );
}

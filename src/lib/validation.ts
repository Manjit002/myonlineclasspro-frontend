/**
 * Pure validation helpers.
 *
 * Deliberately DOM-free (unlike the original site's validators, which
 * read from `document.getElementById` and wrote error text directly).
 * Keeping them pure means they can be unit-tested, reused on any field,
 * and called from a server action later without change.
 */

export const ORDER_MESSAGES = {
  nameRequired: "Please enter your full name.",
  emailInvalid: "Please enter a valid email address.",
  phoneRequired: "Phone / WhatsApp number is required.",
  phoneDigits: "Phone number must be exactly 10 digits.",
  subjectRequired: "Please enter your subject or course name.",
  serviceRequired: "Please choose a service.",
  deadlineRequired: "Please choose a deadline.",
  deadlinePast: "Deadline must be in the future.",
} as const;

export function validateName(value: string): string | undefined {
  return value.trim().length > 0 ? undefined : ORDER_MESSAGES.nameRequired;
}

// Mirrors the pattern the existing site already accepts, rather than
// inventing a stricter one that would reject addresses currently able
// to place orders.
const EMAIL_RE =
  /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export function validateEmail(value: string): string | undefined {
  return EMAIL_RE.test(value.trim()) ? undefined : ORDER_MESSAGES.emailInvalid;
}

/**
 * Exactly 10 digits — no more, no fewer.
 *
 * Strips spaces, dashes, and parentheses first so a pasted number like
 * "(555) 000-0000" is accepted rather than rejected on formatting alone;
 * anything left that isn't a digit still fails the length check.
 */
export function validatePhone(value: string): string | undefined {
  const digits = value.trim().replace(/\D/g, "");
  if (!digits) return ORDER_MESSAGES.phoneRequired;
  if (digits.length !== 10) return ORDER_MESSAGES.phoneDigits;
  return undefined;
}

/** Digits only, capped at 10 — used to sanitise input as the user types. */
export function sanitisePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function validateRequired(
  value: string,
  message: string,
): string | undefined {
  return value.trim().length > 0 ? undefined : message;
}

export function validateDeadline(value: string): string | undefined {
  if (!value.trim()) return ORDER_MESSAGES.deadlineRequired;
  const when = new Date(value);
  if (Number.isNaN(when.getTime())) return ORDER_MESSAGES.deadlineRequired;
  if (when.getTime() <= Date.now()) return ORDER_MESSAGES.deadlinePast;
  return undefined;
}

export interface OrderFormValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  assignmentType: string;
  deadline: string;
  instructions: string;
}

export type OrderFormErrors = Partial<Record<keyof OrderFormValues, string>>;

/** Validates only the fields belonging to a given step. */
export function validateStep(
  step: number,
  values: OrderFormValues,
): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (step === 0) {
    const service = validateRequired(
      values.assignmentType,
      ORDER_MESSAGES.serviceRequired,
    );
    if (service) errors.assignmentType = service;

    const subject = validateRequired(
      values.subject,
      ORDER_MESSAGES.subjectRequired,
    );
    if (subject) errors.subject = subject;

    const deadline = validateDeadline(values.deadline);
    if (deadline) errors.deadline = deadline;
  }

  if (step === 1) {
    const name = validateName(values.fullName);
    if (name) errors.fullName = name;

    const email = validateEmail(values.email);
    if (email) errors.email = email;

    const phone = validatePhone(values.phone);
    if (phone) errors.phone = phone;
  }

  return errors;
}

/** Full-form validation, used as the final gate before submitting. */
export function validateAll(values: OrderFormValues): OrderFormErrors {
  return { ...validateStep(0, values), ...validateStep(1, values) };
}

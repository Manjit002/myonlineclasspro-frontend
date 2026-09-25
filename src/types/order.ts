/**
 * Mirrors the existing Spring Boot backend's GuestOrderRequestDTO.
 * Field names are deliberately kept identical to the API contract --
 * the backend is out of scope for this phase and must not be changed.
 */
export interface OrderRequest {
  name: string;
  email: string;
  /** Exactly 10 digits, including country code prefix handling. */
  phone: string | null;
  subject: string;
  assignmentType: string;
  instructionsWordCount: number;
  instructions: string;
  /** LocalDateTime format the backend expects: yyyy-MM-ddTHH:mm:ss */
  deadline: string;
}

export interface OrderResponse {
  orderId?: string | number;
  message?: string;
  [key: string]: unknown;
}

/** Discriminated union so callers must handle both branches explicitly. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

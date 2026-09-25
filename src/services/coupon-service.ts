import { apiRequest } from "@/lib/api-client";
import type { ApiResult } from "@/types/order";

/**
 * Coupon validation.
 *
 * Endpoint confirmed: POST /coupon/validate
 * (not /payment/coupon/validate — it sits at the root, not under the
 * payment controller.)
 */
export const COUPON_VALIDATE_PATH = "/coupon/validate";

/** Mirrors CouponValidationRequestDTO exactly — do not rename. */
export interface CouponValidationRequest {
  orderId: number;
  couponCode: string;
}

/** Mirrors the backend CouponDiscountType enum. */
export type CouponDiscountType = "PERCENTAGE" | "FIXED";

/** Mirrors CouponValidationResponseDTO exactly — do not rename. */
export interface CouponValidationResponse {
  valid: boolean;
  message: string | null;
  couponCode: string | null;
  discountType: CouponDiscountType | null;
  discountValue: number | null;
  originalAmount: number | null;
  discountAmount: number | null;
  payableAmount: number | null;
}

/**
 * Validates a coupon against an order.
 *
 * The backend is authoritative for every figure: originalAmount,
 * discountAmount and payableAmount are displayed as returned and are
 * never recomputed here, so the UI can't disagree with what the server
 * would actually charge.
 *
 * Note that `valid: false` is a successful HTTP call — the coupon was
 * checked and rejected. That is surfaced through `message`, not as a
 * request error.
 */
export function validateCoupon(
  orderId: number | string,
  couponCode: string,
): Promise<ApiResult<CouponValidationResponse>> {
  return apiRequest<CouponValidationResponse>(COUPON_VALIDATE_PATH, {
    method: "POST",
    body: {
      orderId: Number(orderId),
      couponCode: couponCode.trim(),
    } satisfies CouponValidationRequest,
  });
}

import {
  apiRequest,
  API_BASE_URL,
  getToken,
  friendlyError,
} from "@/lib/api-client";
import type { ApiResult } from "@/types/order";
import type {
  ChatMessage,
  DashboardStats,
  Installment,
  OrderDetail,
  OrderSummary,
  Page,
  PaymentHistory,
  PaymentSummary,
  StudentFile,
  StudentProfile,
  Wallet,
  WalletTransaction,
} from "@/types/dashboard";

/**
 * Every student-dashboard endpoint, in one place.
 *
 * Paths are exactly those the original dashboard used — the Spring Boot
 * contract is unchanged. Only the origin is centralised (api-client).
 */

/* ── Dashboard ── */
export const getDashboard = () =>
  apiRequest<DashboardStats>("/student/student-dashboard");

/**
 * Fallback when /student/student-dashboard fails: derive the same figures
 * from the orders and wallet endpoints so real numbers are always shown
 * rather than "N/A". Mirrors the original's loadDashStatsFromOrders().
 */
export async function getDashboardFallback(): Promise<
  ApiResult<DashboardStats>
> {
  const [all, active, completed, wallet] = await Promise.all([
    getOrders(0, 1),
    getOrders(0, 1, "IN_PROGRESS"),
    getOrders(0, 1, "COMPLETED"),
    getWallet(),
  ]);
  if (!all.ok) return all;
  return {
    ok: true,
    data: {
      totalOrders: all.data?.totalElements ?? 0,
      activeOrders: active.ok ? (active.data?.totalElements ?? 0) : 0,
      completedOrders: completed.ok ? (completed.data?.totalElements ?? 0) : 0,
      pendingOrders: 0,
      walletBalance: wallet.ok ? (wallet.data?.balance ?? null) : null,
    },
  };
}

/* ── Orders ── */
export const getOrders = (page = 0, size = 10, status?: string | null) =>
  apiRequest<Page<OrderSummary>>(
    `/student/orders?page=${page}&size=${size}${status ? `&status=${status}` : ""}`,
  );

export const getOrder = (id: number | string) =>
  apiRequest<OrderDetail>(`/student/orders/${id}`);

/**
 * Place order. The backend expects multipart with a JSON `data` part —
 * NOT a plain JSON request — so the Blob and part name are preserved.
 */
export async function placeOrder(input: {
  subject: string;
  assignmentType: string;
  deadline: string;
  instructions: string;
  files: File[];
}): Promise<ApiResult<{ id: number }>> {
  const payload = {
    subject: input.subject,
    assignmentType: input.assignmentType,
    instructionsWordCount: input.instructions.trim()
      ? input.instructions.trim().split(/\s+/).filter(Boolean).length
      : 0,
    deadline:
      input.deadline.length === 16 ? `${input.deadline}:00` : input.deadline,
    instructions: input.instructions.trim() || null,
    useAutoPricing: true,
    expectedPrice: null,
  };
  const fd = new FormData();
  fd.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
    "data",
  );
  input.files.forEach((f) => fd.append("files", f, f.name));
  return apiRequest<{ id: number }>("/orders", {
    method: "POST",
    formData: fd,
  });
}

/* ── Wallet ── */
export const getWallet = () => apiRequest<Wallet>("/student/wallet");
export const getWalletTransactions = (page = 0, size = 20) =>
  apiRequest<Page<WalletTransaction>>(
    `/wallet/transactions?page=${page}&size=${size}`,
  );
export const topUpWallet = (amount: number) =>
  apiRequest<{ url?: string }>(`/wallet/topup?amount=${amount}`, {
    method: "POST",
  });

/* ── Payments ── */
export const getPayments = () =>
  apiRequest<PaymentHistory[]>("/student/payments");
export const getPaymentSummary = () =>
  apiRequest<PaymentSummary>("/student/payment-summary");

/**
 * Hosted Stripe checkout. The backend returns the URL to redirect to —
 * card details are never handled here.
 */
export const createCheckout = (orderId: number | string, useWallet: boolean) =>
  apiRequest<{ checkoutUrl?: string; url?: string }>(
    `/payment/checkout/${orderId}?useWallet=${useWallet}`,
    { method: "POST" },
  );

/**
 * Wallet contribution is capped at 5% of the order value.
 * This business rule is the original's and is not changed.
 */
export function walletSaving(walletBalance: number, price: number): number {
  if (walletBalance <= 0 || price <= 0) return 0;
  return Math.min(walletBalance, price * 0.05);
}

/* ── Installments ── */
export const getInstallmentsForOrder = (orderId: number | string) =>
  apiRequest<Installment[]>(`/installments/order/${orderId}`);
export const getAllInstallments = () =>
  apiRequest<Installment[]>("/student/installments");
export const payInstallment = (installmentId: number) =>
  apiRequest<{ checkoutUrl?: string; url?: string }>(
    `/installments/pay/${installmentId}`,
    { method: "POST" },
  );

/* ── Deadlines ── */
export const getDeadlines = () =>
  apiRequest<OrderSummary[]>("/student/deadlines");

/* ── Files ── */
export const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB, as the original enforced

export const getOrderFiles = (orderId: number | string, page = 0, size = 12) =>
  apiRequest<Page<StudentFile>>(
    `/files/student/order/${orderId}?page=${page}&size=${size}`,
  );
export const getFileCount = (orderId: number | string) =>
  apiRequest<{ count?: number } | number>(`/files/count/${orderId}`);
export const getDownloadUrl = (fileId: number) =>
  apiRequest<{ downloadUrl?: string; url?: string }>(
    `/files/${fileId}/download`,
  );
export const getPreviewUrl = (fileId: number) =>
  apiRequest<{ previewUrl?: string; url?: string }>(`/files/${fileId}/preview`);

export function uploadFiles(
  orderId: string,
  category: string,
  files: File[],
): Promise<ApiResult<unknown>> {
  const fd = new FormData();
  fd.append("orderId", orderId);
  if (category) fd.append("category", category);
  files.forEach((f) => fd.append("files", f, f.name));
  return apiRequest("/files/student/upload", { method: "POST", formData: fd });
}

/* ── Profile ── */
export const getProfile = () => apiRequest<StudentProfile>("/student/profile");
export const updateProfile = (body: {
  name: string | null;
  phone: string | null;
  country: string | null;
}) => apiRequest<StudentProfile>("/student/profile", { method: "PUT", body });

/** Same endpoint, method and payload as the original implementation. */
export const changePassword = (oldPassword: string, newPassword: string) =>
  apiRequest<unknown>("/student/change-password", {
    method: "PUT",
    body: { oldPassword, newPassword },
  });

/* ── Chat REST ── */
export const getChatHistory = (orderId: number | string) =>
  apiRequest<ChatMessage[]>(
    `/api/order-chat/history/all?orderId=${orderId}&role=STUDENT`,
  );
export const getChatPage = (
  orderId: number | string,
  page: number,
  size = 20,
) =>
  apiRequest<Page<ChatMessage>>(
    `/api/order-chat/history?orderId=${orderId}&role=STUDENT&page=${page}&size=${size}`,
  );
export const searchChat = (orderId: number | string, keyword: string) =>
  apiRequest<Page<ChatMessage>>(
    `/api/order-chat/search?orderId=${orderId}&keyword=${encodeURIComponent(keyword)}&role=STUDENT&page=0&size=50`,
  );
export const markMessageSeen = (messageId: number) =>
  apiRequest<unknown>(`/api/order-chat/seen/${messageId}`, { method: "POST" });
export const getUnreadCount = (orderId: number | string) =>
  apiRequest<number>(`/api/order-chat/unread-count?orderId=${orderId}`);

/** Chat attachment upload. Field name stays `file`; multipart, not base64. */
export async function uploadChatFile(file: File): Promise<
  ApiResult<{
    fileKey: string;
    fileName: string;
    contentType: string;
    fileSize: number;
  }>
> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/api/order-chat/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      return { ok: false, error: friendlyError(b.message || "Upload failed") };
    }
    return { ok: true, data: await res.json() };
  } catch (e) {
    return { ok: false, error: friendlyError((e as Error)?.message) };
  }
}

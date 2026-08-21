import type { BackendDate } from "@/lib/api-client";

/** Page<T> as Spring Data serialises it. */
export interface Page<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
}

export interface OrderSummary {
  id: number;
  subject?: string;
  assignmentType?: string;
  status?: string;
  paymentStatus?: string;
  price?: number | null;
  deadline?: BackendDate;
}

/** Mirrors OrderDetailDTO — no invented fields. */
export interface OrderDetail extends OrderSummary {
  academicLevel?: string;
  university?: string;
  instructions?: string;
  paymentMethod?: string;
  createdAt?: BackendDate;
  expertDeadline?: BackendDate;
  fileCount?: number;
}

export interface DashboardStats {
  totalOrders?: number;
  activeOrders?: number;
  completedOrders?: number;
  pendingOrders?: number;
  walletBalance?: number | null;
  recentOrders?: OrderSummary[];
}

export interface Wallet {
  id?: number | string;
  balance?: number;
}

export interface WalletTransaction {
  id?: number;
  type?: string;
  amount?: number;
  reason?: string;
  balanceAfter?: number;
  createdAt?: BackendDate;
}

export interface PaymentSummary {
  totalPaid?: number;
  pendingInstallments?: number;
}

/** Mirrors PaymentHistoryDTO. */
export interface PaymentHistory {
  id?: number;
  orderId?: number;
  installmentId?: number;
  amount?: number;
  walletUsed?: number;
  currency?: string;
  status?: string;
  success?: boolean;
  failureReason?: string;
  type?: string;
  isInstallment?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  retryCount?: number;
  retryEnabled?: boolean;
  createdAt?: BackendDate;
  statusLabel?: string;
  typeLabel?: string;
}

export interface Installment {
  id: number;
  finalAmount?: number;
  paid?: boolean;
  status?: string;
  dueDate?: BackendDate;
  paidDate?: BackendDate;
}

export interface StudentFile {
  id: number;
  fileName?: string;
  fileSize?: number;
  category?: string;
  uploadedAt?: BackendDate;
}

export interface StudentProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  availabilityStatus?: string;
  online?: boolean;
  verified?: boolean;
  createdAt?: BackendDate;
}

/** Mirrors the chat message DTO exchanged over STOMP and REST. */
export interface ChatMessage {
  messageId: number;
  orderId: number;
  senderId: number | string;
  senderRole?: string;
  message?: string;
  messageType?: string;
  createdAt?: number;
  delivered?: boolean;
  seen?: boolean;
  fileUrl?: string;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  replyToMessageId?: number;
  replySenderName?: string;
  replyMessage?: string;
  receiverId?: number | string;
}

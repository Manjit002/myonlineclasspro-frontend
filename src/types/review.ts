export interface ReviewMedia {
  mediaType?: string; // "IMAGE" | "VIDEO"
  fileUrl?: string;
  thumbnailUrl?: string;
  sortOrder?: number;
}

/** Mirrors the backend's ReviewResponseDTO. Field names are the API's. */
export interface Review {
  id: string | number;
  reviewerName?: string;
  country?: string;
  rating?: number;
  title?: string;
  review?: string;
  createdAt?: string;
  verifiedPurchase?: boolean;
  reviewSource?: string;
  helpfulCount?: number;
  media?: ReviewMedia[];
}

/** Payload for POST ?action=create. Field names match ReviewRequestDTO. */
export interface ReviewSubmission {
  reviewerName: string;
  rating: number;
  title: string;
  review: string;
  email?: string;
  country?: string;
  images: File[];
  videos: File[];
}

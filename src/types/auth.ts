/** Mirrors the backend's AuthResponseDTO. */
export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  userId?: string | number;
  role?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  country: string;
  academicLevel?: string;
  university?: string | null;
}

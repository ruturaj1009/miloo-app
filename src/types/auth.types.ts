export interface AuthAccount {
  account_id: string;
  phone_number?: string;
  country_code?: string;
  email?: string;
  is_verified: boolean;
  is_active?: boolean;
  secure_account?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  account: AuthAccount;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  requires_otp?: boolean;
  token?: string;
  refreshToken?: string;
  account?: AuthAccount;
}

export interface RegisterRequest {
  phone_number?: string;
  country_code?: string;
  email?: string;
  password?: string;
  otp?: string;
  secure_account?: boolean;
  two_step_enabled?: boolean;
}

export interface LoginRequest {
  phone_number?: string;
  country_code?: string;
  email?: string;
  otp?: string;
  password?: string;
  provider?: string;
}

export interface VerifyOtpRequest {
  phone_number?: string;
  country_code?: string;
  email?: string;
  otp: string;
}

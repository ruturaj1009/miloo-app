export interface AuthAccount {
  account_id: string;
  phone_number?: string;
  email?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  account: AuthAccount;
}

export interface RegisterRequest {
  phone_number?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export interface LoginRequest {
  phone_number?: string;
  email?: string;
  otp?: string;
  password?: string;
}

export interface VerifyOtpRequest {
  phone_number?: string;
  email?: string;
  otp: string;
}

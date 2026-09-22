import { create } from 'zustand';
import { AuthAccount, AuthSession, LoginRequest, RegisterRequest, VerifyOtpRequest } from '../types/auth.types';
import { authApi } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  account: AuthAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumberForOtp: string | null;

  initAuth: () => Promise<void>;
  register: (req: RegisterRequest) => Promise<AuthSession>;
  login: (req: LoginRequest) => Promise<boolean>;
  verifyOtp: (req: VerifyOtpRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setPhoneNumberForOtp: (phone: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  account: {
    account_id: 'usr_me_001',
    phone_number: '+1 (555) 234-5678',
    email: 'alex@apexlabs.io',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  token: 'mock_jwt_token_demo_123456',
  isAuthenticated: true, // Set to true by default for immediate live preview, user can logout or test auth screen
  isLoading: false,
  error: null,
  phoneNumberForOtp: null,

  initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Failed to restore auth token', e);
    }
  },

  register: async (req: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authApi.register(req);
      set({
        account: session.account,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return session;
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  login: async (req: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.login(req);
      set({
        phoneNumberForOtp: req.phone_number || req.email || null,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  verifyOtp: async (req: VerifyOtpRequest) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authApi.verifyOtp(req);
      set({
        account: session.account,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Invalid OTP code', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await authApi.logout();
    set({
      account: null,
      token: null,
      isAuthenticated: false,
      phoneNumberForOtp: null,
    });
  },

  clearError: () => set({ error: null }),
  setPhoneNumberForOtp: (phone) => set({ phoneNumberForOtp: phone }),
}));

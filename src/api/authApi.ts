import { apiClient, USE_MOCK_API } from './client';
import { AuthSession, LoginRequest, LoginResponse, RegisterRequest, VerifyOtpRequest } from '../types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthSession> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 600));
      const session: AuthSession = {
        token: 'mock_jwt_token_demo_123456',
        account: {
          account_id: 'usr_me_001',
          phone_number: data.phone_number,
          email: data.email,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      await AsyncStorage.setItem('@auth_token', session.token);
      return session;
    }
    const response = await apiClient.post<AuthSession>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('@auth_token', response.data.token);
    }
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, message: 'OTP sent successfully to ' + (data.phone_number || data.email), requires_otp: true };
    }
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('@auth_token', response.data.token);
    }
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<AuthSession> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 700));
      const session: AuthSession = {
        token: 'mock_jwt_token_demo_123456',
        account: {
          account_id: 'usr_me_001',
          phone_number: data.phone_number,
          email: data.email,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      await AsyncStorage.setItem('@auth_token', session.token);
      return session;
    }
    const response = await apiClient.post<AuthSession>('/auth/verify-otp', data);
    if (response.data.token) {
      await AsyncStorage.setItem('@auth_token', response.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('@auth_token');
  },
};

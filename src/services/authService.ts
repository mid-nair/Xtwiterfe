import { apiClient } from '@/lib/apiClient';
import type { AuthSession, LoginPayload, RegisterPayload } from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/register', payload);
    return data;
  },
};

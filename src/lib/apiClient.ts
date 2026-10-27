import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // An expired or revoked token ends the session; route guards redirect to /login.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const { token, clearSession } = useAuthStore.getState();
      if (token) clearSession();
    }
    return Promise.reject(error);
  },
);

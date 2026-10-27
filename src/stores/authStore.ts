import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  setSession: (session: AuthSession) => void;
  updateUser: (partial: Partial<User>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      updateUser: (partial) =>
        set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'x-auth',
      partialize: ({ token, user }) => ({ token, user }),
    },
  ),
);

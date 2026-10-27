import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';

/** For components rendered inside <ProtectedRoute>, where a user always exists. */
export function useRequiredUser(): User {
  const user = useAuthStore((state) => state.user);
  if (!user) throw new Error('useRequiredUser must be used inside an authenticated route.');
  return user;
}

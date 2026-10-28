import { isBirthdayUser } from '@/config/birthday';
import { useAuthStore } from '@/stores/authStore';

/** True only when the signed-in account is the birthday girl's. */
export function useIsBirthdayUser(): boolean {
  return useAuthStore((state) => isBirthdayUser(state.user));
}

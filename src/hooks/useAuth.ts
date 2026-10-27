import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({ mutationFn: authService.login, onSuccess: setSession });
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({ mutationFn: authService.register, onSuccess: setSession });
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  return () => {
    clearSession();
    queryClient.clear(); // never leak one account's cached data into the next session
  };
}

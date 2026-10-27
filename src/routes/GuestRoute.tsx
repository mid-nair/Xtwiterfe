import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/** Login/register pages; signed-in users are sent back to where they came from. */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => !!state.token && !!state.user);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return isAuthenticated ? <Navigate to={from} replace /> : <Outlet />;
}

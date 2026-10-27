import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/** Renders child routes only for signed-in users. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => !!state.token && !!state.user);
  const location = useLocation();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

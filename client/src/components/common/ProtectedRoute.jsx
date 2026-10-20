import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from './Spinner';

// Only shows its child routes to logged-in users
export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your session…" />;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}

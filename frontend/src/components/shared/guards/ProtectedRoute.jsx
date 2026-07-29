import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import LoadingScreen from '../LoadingScreen';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRolesLower = user?.roles?.map((r) => String(r).toLowerCase()) || [];
    const isSuperAdmin   = userRolesLower.includes('super admin');
    
    const allowedLower = allowedRoles.map((r) => String(r).toLowerCase());
    const hasRole      = isSuperAdmin || userRolesLower.some((role) => allowedLower.includes(role));

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

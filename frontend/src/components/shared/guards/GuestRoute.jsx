import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import LoadingScreen from '../LoadingScreen';

const getDashboardPath = (roles = []) => {
  if (roles.includes('Super Admin'))                       return '/dashboard/super-admin';
  if (roles.includes('Company Admin'))                     return '/dashboard/company-admin';
  if (roles.includes('seller') || roles.includes('Seller')) return '/dashboard/seller';
  return '/dashboard/customer';
};

const GuestRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user?.roles)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

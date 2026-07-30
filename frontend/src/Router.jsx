import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/shared/Layout';
import GuestRoute from './components/shared/guards/GuestRoute';
import ProtectedRoute from './components/shared/guards/ProtectedRoute';
import LoadingScreen from './components/shared/LoadingScreen';

import LoginPage from './pages/shared/LoginPage';
import RegisterPage from './pages/shared/RegisterPage';
import ForgotPasswordPage from './pages/shared/ForgotPasswordPage';
import VerifyOTPPage from './pages/shared/VerifyOTPPage';

const HomePage = lazy(() => import('./pages/shared/HomePage'));
const PropertiesPage = lazy(() => import('./pages/shared/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('./pages/shared/PropertyDetailPage'));
const BecomeVendorPage = lazy(() => import('./pages/shared/BecomeVendorPage'));
const BookingSuccessPage = lazy(() => import('./pages/customer/BookingSuccessPage'));
const BookingCheckoutPage = lazy(() => import('./pages/customer/BookingCheckoutPage'));
const NotFoundPage = lazy(() => import('./pages/shared/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/shared/UnauthorizedPage'));

const SuperAdminDashboard = lazy(() => import('./pages/superAdmin/SuperAdminDashboard'));
const CompanyAdminDashboard = lazy(() => import('./pages/companyAdmin/CompanyAdminDashboard'));
const SellerDashboard = lazy(() => import('./pages/companyAdmin/SellerDashboard'));
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const MyPropertiesPage = lazy(() => import('./pages/companyAdmin/MyPropertiesPage'));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="companies" element={<Navigate to="/properties" replace />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['user', 'customer', 'Company Admin', 'seller', 'Seller', 'Super Admin']} />}>
              <Route path="/become-vendor" element={<BecomeVendorPage />} />
              <Route path="/checkout/:id" element={<BookingCheckoutPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
              <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Company Admin']} />}>
              <Route path="/dashboard/company-admin" element={<CompanyAdminDashboard />} />
              <Route path="/dashboard/my-properties" element={<MyPropertiesPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['seller', 'Seller']} />}>
              <Route path="/dashboard/seller" element={<SellerDashboard />} />
            </Route>

            {}
            <Route path="/booking-checkout/:id" element={<BookingCheckoutPage />} />
            <Route path="/super-admin" element={<Navigate to="/dashboard/super-admin" replace />} />
            <Route path="/company-admin" element={<Navigate to="/dashboard/company-admin" replace />} />
            <Route path="/seller-dashboard" element={<Navigate to="/dashboard/seller" replace />} />
            <Route path="/customer-dashboard" element={<Navigate to="/dashboard/customer" replace />} />
            <Route path="/customer-dashboard/my-properties" element={<Navigate to="/dashboard/my-properties" replace />} />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;

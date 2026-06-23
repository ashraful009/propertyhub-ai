import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/shared/Home";
import Auth from "../pages/shared/Auth";
import PropertyDetails from "../pages/shared/PropertyDetails";
import AboutUs from "../pages/shared/AboutUs";
import Profile from "../pages/shared/Profile";
import Checkout from "../pages/customer/Checkout";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Installments from "../pages/customer/Installments";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import PaymentCancel from "../pages/customer/PaymentCancel";
import VendorApplication from "../pages/shared/VendorApplication";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VendorManagement from "../pages/admin/VendorManagement";
import PolicyManager from "../pages/admin/PolicyManager";
import PropertyRequests from "../pages/admin/PropertyRequests";
import VendorLayout from "../layouts/VendorLayout";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import AddProperty from '../pages/vendor/AddProperty';
import CustomersAndDues from '../pages/vendor/CustomersAndDues';
import MyProperties from '../pages/vendor/MyProperties';
import EditProperty from '../pages/vendor/EditProperty';
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        {/* Only Authenticated users can checkout or apply as vendor */}
        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/vendor-application" element={<VendorApplication />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/customer" element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route element={<CustomerLayout />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="installments" element={<Installments />} />
        </Route>
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="property-requests" element={<PropertyRequests />} />
          <Route path="policies" element={<PolicyManager />} />
        </Route>
      </Route>

      <Route path="/vendor" element={<ProtectedRoute allowedRoles={['VENDOR']} />}>
        <Route element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="properties" element={<MyProperties />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
          <Route path="customers" element={<CustomersAndDues />} />
        </Route>
      </Route>
    </Routes>
  );
}

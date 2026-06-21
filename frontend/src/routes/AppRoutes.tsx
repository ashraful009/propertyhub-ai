import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/shared/Home";
import Auth from "../pages/shared/Auth";
import PropertyDetails from "../pages/shared/PropertyDetails";
import Checkout from "../pages/customer/Checkout";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Installments from "../pages/customer/Installments";
import VendorApplication from "../pages/shared/VendorApplication";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VendorManagement from "../pages/admin/VendorManagement";
import PolicyManager from "../pages/admin/PolicyManager";
import VendorLayout from "../layouts/VendorLayout";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import AddProperty from '../pages/vendor/AddProperty';
import CustomersAndDues from '../pages/vendor/CustomersAndDues';
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/vendor-application" element={<VendorApplication />} />
      </Route>
      <Route path="/customer" element={<CustomerLayout />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="installments" element={<Installments />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="policies" element={<PolicyManager />} />
      </Route>
      <Route path="/vendor" element={<VendorLayout />}>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="customers" element={<CustomersAndDues />} />
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
    </Routes>
  );
}

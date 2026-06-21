import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/shared/Home";
import Auth from "../pages/shared/Auth";
import PropertyDetails from "../pages/shared/PropertyDetails";
import Checkout from "../pages/customer/Checkout";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Installments from '../pages/customer/Installments';
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="/customer" element={<CustomerLayout />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="installments" element={<Installments />} />
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
    </Routes>
  );
}

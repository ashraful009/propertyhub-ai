import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/shared/Home';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* ভবিষ্যতে এখানে আরও পেজ অ্যাড করবো, যেমন: */}
        {/* <Route path="/properties" element={<Properties />} /> */}
      </Route>

      {/* 404 Route (optional, can add later) */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
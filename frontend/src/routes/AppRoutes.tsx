import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/shared/Home';
import NotFound from '../pages/shared/NotFound';
// import PropertySearch from '../pages/shared/PropertySearch';
// import Login from '../pages/shared/Login';
// import Register from '../pages/shared/Register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Shared Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/search" element={<PropertySearch />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Protected routes will go here with their respective layouts */}
    </Routes>
  );
}

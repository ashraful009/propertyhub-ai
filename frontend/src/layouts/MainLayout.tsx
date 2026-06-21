import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
// Footer তৈরি করলে পরে এখানে ইমপোর্ট করবো

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc]">
      <Navbar />
      
      <main className="flex-grow">
        {/* এই Outlet-এর জায়গাতেই Home, Search, Details পেজগুলো লোড হবে */}
        <Outlet />
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}
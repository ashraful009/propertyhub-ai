import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../../store/authStore';
import { cn } from '../../../../utils/cn';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হওয়ার লজিক
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ইউজার লগইন করা না থাকলে Login বাটন দেখাবে
  if (!user) {
    return (
      <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        Login
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  // রোল অনুযায়ী ড্যাশবোর্ডের লিংক (যেমন: /admin/dashboard)
  const dashboardLink = `/${user.role.toLowerCase()}/dashboard`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${user.name}&background=eff6ff&color=2563eb&bold=true`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.1)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-105"
      >
        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
      </button>

      {/* 3D Glassmorphism Dropdown Menu */}
      <div className={cn(
        "absolute right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 py-2 z-50 transform transition-all duration-200 origin-top-right",
        isOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
      )}>
        <div className="px-4 py-3 border-b border-gray-100/50">
          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5 capitalize">{user.role.toLowerCase()}</p>
        </div>
        
        <div className="py-2">
          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors">
            <User className="w-4 h-4 mr-3" /> My Profile
          </Link>
          <Link to={dashboardLink} onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
          </Link>
        </div>

        <div className="border-t border-gray-100/50 py-2">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
            <LogOut className="w-4 h-4 mr-3" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
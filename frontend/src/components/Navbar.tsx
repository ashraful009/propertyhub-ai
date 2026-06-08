import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Glassmorphism Setup: sticky top, bg-white/70 for transparency, backdrop-blur-lg for the frosted glass effect
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-wider text-gray-900">
          Solara<span className="text-[#153B28]">Hub</span>
        </Link>

        {/* Navigation Links & Auth State */}
        <div className="flex items-center space-x-8 font-medium">
          <Link to="/" className="text-gray-600 hover:text-[#153B28] transition-colors">Home</Link>
          <Link to="/properties" className="text-gray-600 hover:text-[#153B28] transition-colors">Properties</Link>
          
          {user ? (
            <div className="flex items-center space-x-4 ml-2 pl-6 border-l border-gray-300">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="bg-[#153B28]/10 p-1.5 rounded-full text-[#153B28]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-sm">
                  {user.name} <span className="text-emerald-600 text-xs font-semibold">({user.role})</span>
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-x-4 ml-2 pl-6 border-l border-gray-300">
              <Link to="/login" className="text-gray-600 hover:text-[#153B28] transition-colors">Sign In</Link>
              <Link to="/login" className="bg-[#153B28] hover:bg-[#112d1e] text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
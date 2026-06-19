import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      "glass border-b border-white/20"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">PropertyHub</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/search" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Properties
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDOR' ? '/vendor' : '/customer'}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
                >
                  <UserIcon size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building, Users, Banknote, 
  Menu, Bell, Store, PlusCircle 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function VendorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'My Properties', path: '/vendor/properties', icon: Building },
    { name: 'Customers & Dues', path: '/vendor/customers', icon: Users },
    { name: 'Earnings & Payouts', path: '/vendor/earnings', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-indigo-800">
          <Link to="/" className="flex items-center gap-2">
            <Store className="w-7 h-7 text-indigo-400" />
            <span className="font-bold text-xl tracking-wide">VendorHub</span>
          </Link>
        </div>

        <div className="p-4">
          <Link to="/vendor/add-property" className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/20">
            <PlusCircle size={18} /> Add Property
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-indigo-300'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Vendor Portal</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                {user?.name?.charAt(0) || 'V'}
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-gray-700">{user?.name || 'Vendor'}</p>
                <p className="text-xs text-indigo-600 font-medium">Verified Vendor</p>
              </div>
            </div>
          </div>
        </header>

        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
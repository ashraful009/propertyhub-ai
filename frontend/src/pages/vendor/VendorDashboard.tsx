import { Banknote, Building, Users, Activity, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVendorDashboard } from '../../hooks/api/useDashboard';
import { useAuthStore } from '../../store/authStore';

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading, isError } = useVendorDashboard();

  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="text-center text-red-500 p-4">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  const totalSales = Number(dashboardData.totalSales || 0);
  const netEarnings = totalSales * 0.95; // 5% fee assumption
  const activeProperties = dashboardData.propertyInsights.reduce((sum, item) => sum + Number(item.count), 0);
  const totalUpcomingDues = Number(dashboardData.upcomingDuesNextMonth || 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Vendor'}!</h1>
        <p className="text-gray-500">Here is what's happening with your properties today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Banknote size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Gross Sales</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(totalSales)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Net Earnings (After 5% fee)</p>
          <h3 className="text-2xl font-extrabold text-green-600">{formatBDT(netEarnings)}</h3>
          <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">
            Settled
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Properties</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{activeProperties}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Recent Defaulters</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{dashboardData.defaultersLastMonth.length}</h3>
        </div>
      </div>

      {/* Recent Bookings & Pending Installments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600"/> Recent Bookings
            </h3>
            <Link to="/vendor/customers" className="text-sm text-indigo-600 font-semibold hover:underline">View All</Link>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            {dashboardData.recentBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent bookings</div>
            ) : (
              dashboardData.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&q=80`} alt="prop" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{booking.property}</h4>
                    <p className="text-xs text-gray-500">Booked by {booking.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">{new Date(booking.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Installments Notification */}
        <div className="bg-slate-900 rounded-2xl shadow-sm overflow-hidden text-white flex flex-col justify-center p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-indigo-300 font-medium mb-2 text-sm uppercase tracking-wider">Upcoming Dues Alert</p>
            <h3 className="text-3xl font-extrabold mb-4">Total Due: {formatBDT(totalUpcomingDues)}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              This amount is expected to be collected from customers within the next 30 days. You have <strong>{dashboardData.defaultersLastMonth.length}</strong> defaulters from last month.
            </p>
            <Link to="/vendor/customers" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              Manage Customers <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
import { Wallet, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerDashboard } from '../../hooks/api/useDashboard';
import { useAuthStore } from '../../store/authStore';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading, isError } = useCustomerDashboard();

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

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Customer'}!</h1>
        <p className="text-gray-500">Here is what's happening with your properties today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">{formatBDT(dashboardData.financialOverview.totalPaid)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Due</p>
            <p className="text-2xl font-bold text-gray-900">{formatBDT(dashboardData.financialOverview.totalDue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Next Installment</p>
            <p className="text-xl font-bold text-gray-900">
              {dashboardData.upcomingPayment ? new Date(dashboardData.upcomingPayment.due_date).toLocaleDateString() : 'No Dues'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Property Progress */}
      {dashboardData.upcomingPayment ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Active Booking</h2>
            <Link to="/customer/installments" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Pay Installment <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80" 
              alt="Property" 
              className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-sm"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{dashboardData.upcomingPayment.property_title}</h3>
                  <p className="text-gray-500 text-sm">Next Due: {formatBDT(dashboardData.upcomingPayment.amount)}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500">You don't have any active installments due right now.</p>
        </div>
      )}
    </div>
  );
}
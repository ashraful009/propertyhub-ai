import { Banknote, Building, Users, Activity, ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, BuildWell!</h1>
        <p className="text-gray-500">Here is what's happening with your properties today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Banknote size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Gross Sales</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(150000000)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Net Earnings (After 5% fee)</p>
          <h3 className="text-2xl font-extrabold text-green-600">{formatBDT(142500000)}</h3>
          <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">
            Settled
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Properties</p>
          <h3 className="text-2xl font-extrabold text-gray-900">12</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Customers</p>
          <h3 className="text-2xl font-extrabold text-gray-900">45</h3>
        </div>
      </div>

      {/* Recent Bookings & Pending Installments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600"/> Recent Bookings
            </h3>
            <Link to="/vendor/customers" className="text-sm text-indigo-600 font-semibold hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&q=80`} alt="prop" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Oceanview Apt - Unit A4</h4>
                  <p className="text-xs text-gray-500">Booked by Ashraful Islam</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">+ {formatBDT(500000)}</div>
                  <div className="text-[10px] text-gray-400">Booking Money</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Installments Notification */}
        <div className="bg-slate-900 rounded-2xl shadow-sm overflow-hidden text-white flex flex-col justify-center p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-indigo-300 font-medium mb-2 text-sm uppercase tracking-wider">Installment Alert</p>
            <h3 className="text-3xl font-extrabold mb-4">15 Customers</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              have their monthly installments due within the next 7 days. Total expected collection: <strong className="text-white">{formatBDT(6500000)}</strong>
            </p>
            <Link to="/vendor/customers" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              Send Reminders <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
import { Wallet, Building, Users, TrendingUp, ArrowUpRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/api/useDashboard';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, isError } = useAdminDashboard();

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

  const totalCommission = Number(dashboardData.totalRevenue || 0);
  const totalSales = totalCommission / 0.05;
  const activeProperties = dashboardData.propertyStatus.reduce((sum, item) => sum + Number(item.count), 0);
  const activeVendors = Number(dashboardData.userStatistics.find(u => u.role === 'VENDOR')?.count || 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Real-time statistics and revenue tracking.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Platform Revenue (5%)</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(totalCommission)}</h3>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Property Sales (GMV)</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(totalSales)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Properties</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{activeProperties}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Vendors</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{activeVendors}</h3>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue by Vendor</h3>
            <p className="text-sm text-gray-500 mt-1">Platform commission tracking per agency</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="py-4 px-6 font-medium">Vendor Name</th>
                <th className="py-4 px-6 font-medium">Total Sales (GMV)</th>
                <th className="py-4 px-6 font-bold text-blue-700 bg-blue-50/50">Our Commission (5%)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dashboardData.revenueByCompany.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    No revenue data available
                  </td>
                </tr>
              ) : (
                dashboardData.revenueByCompany.map((vendor, index) => (
                  <tr key={index} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{vendor.company_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">Active Vendor</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{formatBDT(Number(vendor.revenue) / 0.05)}</td>
                    <td className="py-4 px-6 font-extrabold text-blue-700 bg-blue-50/30">
                      {formatBDT(Number(vendor.revenue))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { Wallet, Building, Users, TrendingUp, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  // ডামি ভেন্ডর রেভিনিউ ডাটা (ভবিষ্যতে API থেকে আসবে)
  const vendorRevenues = [
    { id: 1, name: "BuildWell Properties", totalSales: 150000000, commission: 7500000, properties: 12, status: "top-tier" },
    { id: 2, name: "Skyline Developers", totalSales: 85000000, commission: 4250000, properties: 8, status: "active" },
    { id: 3, name: "Metro Housing Ltd.", totalSales: 45000000, commission: 2250000, properties: 4, status: "active" },
    { id: 4, name: "Urban Living Real Estate", totalSales: 12000000, commission: 600000, properties: 2, status: "new" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">Real-time statistics and revenue tracking.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Platform Revenue (5%)</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(14600000)}</h3>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Property Sales (GMV)</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{formatBDT(292000000)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Properties</p>
          <h3 className="text-2xl font-extrabold text-gray-900">124</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Vendors</p>
          <h3 className="text-2xl font-extrabold text-gray-900">32</h3>
        </div>
      </div>

      {/* Revenue by Vendor Table */}
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
                <th className="py-4 px-6 font-medium">Properties Sold</th>
                <th className="py-4 px-6 font-medium">Total Sales (GMV)</th>
                <th className="py-4 px-6 font-bold text-blue-700 bg-blue-50/50">Our Commission (5%)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {vendorRevenues.map((vendor) => (
                <tr key={vendor.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{vendor.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 capitalize">{vendor.status} Vendor</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{vendor.properties} Units</td>
                  <td className="py-4 px-6 text-gray-600">{formatBDT(vendor.totalSales)}</td>
                  <td className="py-4 px-6 font-extrabold text-blue-700 bg-blue-50/30">
                    {formatBDT(vendor.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
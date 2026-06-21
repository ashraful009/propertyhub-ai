import { useState } from 'react';
import { Search, Filter, BellRing, AlertCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVendorDashboard } from '../../hooks/api/useDashboard';

export default function CustomersAndDues() {
  const { data: dashboardData, isLoading, isError } = useVendorDashboard();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  const handleSendReminder = (name: string) => {
    setSendingId(name);
    setTimeout(() => {
      setSendingId(null);
      toast.success(`Payment reminder sent to ${name} via SMS & Email!`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="text-center text-red-500 p-4">
        Failed to load customer data. Please try again later.
      </div>
    );
  }

  const customers = dashboardData.defaultersLastMonth;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Defaulters</h1>
          <p className="text-gray-500">Track overdue installment payments and send reminders.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="py-4 px-6 font-medium">Customer Details</th>
                <th className="py-4 px-6 font-medium">Property</th>
                <th className="py-4 px-6 font-medium">Overdue Amount</th>
                <th className="py-4 px-6 font-medium">Due Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No defaulters found. All customers are up to date!
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{customer.customer_name}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-800">{customer.property}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-red-600">{formatBDT(customer.amount)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {new Date(customer.due_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-bold border border-red-100">
                        <AlertCircle size={14} /> Overdue
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleSendReminder(customer.customer_name)}
                        disabled={sendingId === customer.customer_name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold transition-colors disabled:opacity-50"
                      >
                        <BellRing size={16} /> {sendingId === customer.customer_name ? 'Sending...' : 'Remind'}
                      </button>
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
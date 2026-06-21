import { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Download, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Installments() {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  // ডামি কিস্তির ডাটা (ভবিষ্যতে API থেকে আসবে)
  const schedule = [
    { id: 1, month: 'Month 1', date: '15 Sep, 2026', amount: 408333, status: 'paid', receiptId: 'INV-001' },
    { id: 2, month: 'Month 2', date: '15 Oct, 2026', amount: 408333, status: 'due', receiptId: null },
    { id: 3, month: 'Month 3', date: '15 Nov, 2026', amount: 408333, status: 'upcoming', receiptId: null },
    { id: 4, month: 'Month 4', date: '15 Dec, 2026', amount: 408333, status: 'upcoming', receiptId: null },
    { id: 5, month: 'Month 5', date: '15 Jan, 2027', amount: 408333, status: 'upcoming', receiptId: null },
  ];

  const handlePayNow = () => {
    setIsProcessing(true);
    // পেমেন্ট গেটওয়ের ডামি সিমুলেশন
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Installment Paid Successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Installment Schedule</h1>
        <p className="text-gray-500">Manage your payments for: <span className="font-semibold text-gray-700">Luxury Oceanview Apartment (Unit A-4)</span></p>
      </div>

      {/* Next Payment Highlight Card */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-900/20">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <AlertCircle size={32} className="text-blue-400" />
          </div>
          <div>
            <p className="text-blue-200 font-medium mb-1">Next Payment Due</p>
            <h2 className="text-3xl font-extrabold">{formatBDT(408333)}</h2>
            <p className="text-sm text-gray-300 mt-1 flex items-center gap-1.5">
              <Clock size={14} /> Due by 15 Oct, 2026
            </p>
          </div>
        </div>
        <button 
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Processing...' : (
            <>Pay Installment Now <ChevronRight size={20} /></>
          )}
        </button>
      </div>

      {/* Payment History & Schedule Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Payment Timeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="py-4 px-6 font-medium">Installment</th>
                <th className="py-4 px-6 font-medium">Due Date</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {schedule.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-900">{item.month}</td>
                  <td className="py-4 px-6 text-gray-600">{item.date}</td>
                  <td className="py-4 px-6 font-medium text-gray-900">{formatBDT(item.amount)}</td>
                  <td className="py-4 px-6">
                    {item.status === 'paid' && (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    )}
                    {item.status === 'due' && (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        <AlertCircle size={14} /> Due Now
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold">
                        <Clock size={14} /> Upcoming
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.status === 'paid' && (
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1.5 w-full">
                        <Download size={16} /> Receipt
                      </button>
                    )}
                    {item.status === 'due' && (
                      <button onClick={handlePayNow} className="text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 ml-auto transition-colors">
                        <CreditCard size={16} /> Pay
                      </button>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="text-gray-400">-</span>
                    )}
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
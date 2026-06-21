import { CreditCard, CheckCircle2, Clock, AlertCircle, Download, ChevronRight, Loader2 } from 'lucide-react';
import { useBookings } from '../../hooks/api/useBookings';
import { useInstallmentSchedule } from '../../hooks/api/useInstallments';
import { useCreateCheckoutSession } from '../../hooks/api/usePayment';

export default function Installments() {
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const activeBooking = bookings?.find((b) => b.status === 'APPROVED') || bookings?.[0];

  const { data: scheduleData, isLoading: isLoadingSchedule } = useInstallmentSchedule(activeBooking?.id || null);
  const { mutate: createCheckoutSession, isPending: isProcessing } = useCreateCheckoutSession();

  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  const handlePayNow = (milestoneId?: string, amount?: number) => {
    if (!activeBooking || !amount) return;
    createCheckoutSession({
      booking_id: activeBooking.id,
      milestone_id: milestoneId,
      amount: amount,
      description: `Installment Payment for Booking ${activeBooking.id}`
    });
  };

  if (isLoadingBookings || isLoadingSchedule) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
        <p className="text-gray-500">You don't have any bookings yet.</p>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
        <p className="text-gray-500">Installment schedule not generated for this booking yet.</p>
      </div>
    );
  }

  const { milestones } = scheduleData;
  const nextPayment = milestones.find((m) => m.status === 'UNPAID');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Installment Schedule</h1>
        <p className="text-gray-500">Manage your payments for your active booking.</p>
      </div>

      {/* Next Payment Highlight Card */}
      {nextPayment && (
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-900/20">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <AlertCircle size={32} className="text-blue-400" />
            </div>
            <div>
              <p className="text-blue-200 font-medium mb-1">Next Payment Due</p>
              <h2 className="text-3xl font-extrabold">{formatBDT(nextPayment.amount)}</h2>
              <p className="text-sm text-gray-300 mt-1 flex items-center gap-1.5">
                <Clock size={14} /> Due by {new Date(nextPayment.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => handlePayNow(nextPayment.id, nextPayment.amount)}
            disabled={isProcessing}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : (
              <>Pay Installment Now <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      )}

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
              {milestones.map((item) => {
                const isNextUnpaid = item.id === nextPayment?.id;

                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">Month {item.installment_number}</td>
                    <td className="py-4 px-6 text-gray-600">{new Date(item.due_date).toLocaleDateString()}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{formatBDT(item.amount)}</td>
                    <td className="py-4 px-6">
                      {item.status === 'PAID' && (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">
                          <CheckCircle2 size={14} /> Paid
                        </span>
                      )}
                      {item.status === 'UNPAID' && isNextUnpaid && (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold">
                          <AlertCircle size={14} /> Due Now
                        </span>
                      )}
                      {item.status === 'UNPAID' && !isNextUnpaid && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold">
                          <Clock size={14} /> Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'PAID' && (
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1.5 w-full">
                          <Download size={16} /> Receipt
                        </button>
                      )}
                      {item.status === 'UNPAID' && isNextUnpaid && (
                        <button 
                          onClick={() => handlePayNow(item.id, item.amount)} 
                          disabled={isProcessing}
                          className="text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 ml-auto transition-colors disabled:bg-slate-400"
                        >
                          <CreditCard size={16} /> {isProcessing ? 'Processing...' : 'Pay'}
                        </button>
                      )}
                      {item.status === 'UNPAID' && !isNextUnpaid && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
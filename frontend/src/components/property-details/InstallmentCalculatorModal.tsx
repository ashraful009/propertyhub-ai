import { useState, useEffect } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';

import { useBookingStore } from '../../store/bookingStore';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  totalPrice: number;
  minBookingMoney: number;
  maxInstallments: number;
}

export default function InstallmentCalculatorModal({ isOpen, onClose, propertyId, totalPrice, minBookingMoney, maxInstallments }: CalculatorProps) {
  const setBookingPlan = useBookingStore(state => state.setBookingPlan);

  const [downPayment, setDownPayment] = useState<number>(minBookingMoney || 500000); 
  const [years, setYears] = useState<number>(maxInstallments ? maxInstallments / 12 : 5);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);


  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setDownPayment(minBookingMoney || 500000);
      setYears(maxInstallments ? maxInstallments / 12 : 5);
    }
  }


  const remainingBalance = totalPrice - downPayment;
  const totalMonths = years * 12;
  const monthlyInstallment = remainingBalance > 0 ? remainingBalance / totalMonths : 0;


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;


  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  const handleApply = () => {
    setBookingPlan(propertyId, downPayment, years * 12);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calculator size={24} className="text-blue-200" />
            <h3 className="text-xl font-bold">Installment Calculator</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-200 hover:text-white bg-blue-700/50 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Total Property Price</span>
            <span className="text-xl font-bold text-gray-900">{formatBDT(totalPrice)}</span>
          </div>

          
          <div className="space-y-5">
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Down Payment (Booking Money)</span>
                <span className="text-blue-600 font-bold">{formatBDT(downPayment)}</span>
              </label>
              <input 
                type="range" 
                min={minBookingMoney || 100000} 
                max={totalPrice * 0.5}
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installment Duration
              </label>
              <select 
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-gray-700"
              >
                {[...Array(maxInstallments ? maxInstallments / 12 : 10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Year{i > 0 ? 's' : ''} ({(i + 1) * 12} Months)</option>
                ))}
              </select>
            </div>
          </div>

          
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Remaining Balance</span>
              <span className="font-semibold text-slate-700">{formatBDT(remainingBalance)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-slate-200">
              <span className="text-slate-500 font-medium mb-1">Estimated Monthly</span>
              <span className="text-3xl font-extrabold text-blue-600">{formatBDT(monthlyInstallment)}</span>
            </div>
          </div>
          
          
          <button 
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 mt-4"
          >
            Apply This Plan <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
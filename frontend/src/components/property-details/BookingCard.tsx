import { useState } from 'react';
import { Calculator, CalendarCheck } from 'lucide-react';
import InstallmentCalculatorModal from './InstallmentCalculatorModal';
import BookingPolicyModal from '../policy/BokingPolicyModal';

export default function BookingCard() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false); // নতুন স্টেট
  
  const propertyPrice = 25000000; // 2.5 Crore BDT

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative z-10">
        <div className="mb-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Price</p>
          <h2 className="text-3xl font-extrabold text-gray-900">৳ 2,50,00,000</h2>
          <p className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 5 Units Available
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setIsCalculatorOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-semibold py-3.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Calculator size={20} />
            Calculate Installment
          </button>

          {/* Book Now Button triggers Policy Modal */}
          <button 
            onClick={() => setIsPolicyOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <CalendarCheck size={20} />
            Book Now
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Booking amount: <span className="font-bold text-gray-900">৳ 5,00,000</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Secure your unit instantly via SSLCommerz or Stripe.
          </p>
        </div>
      </div>

      {/* Modals */}
      <InstallmentCalculatorModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
        totalPrice={propertyPrice}
      />
      
      <BookingPolicyModal 
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        propertyId="prop-123" // Test ID
      />
    </>
  );
}
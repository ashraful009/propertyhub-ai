import { useState } from 'react';
import { Calculator, CalendarCheck } from 'lucide-react';
import InstallmentCalculatorModal from './InstallmentCalculatorModal';
import BookingPolicyModal from '../policy/BokingPolicyModal';
import type { IProperty } from '../../types/shared.types';

import { useBookingStore } from '../../store/bookingStore';

export default function BookingCard({ property }: { property: IProperty }) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  
  const { propertyId, selectedBookingMoney, setBookingPlan } = useBookingStore();
  
  const propertyPrice = Number(property.price);
  const minBookingMoney = Number(property.booking_money) || 500000;
  const maxInstallments = property.total_installments || 60;
  
  const displayBookingMoney = propertyId === property.id && selectedBookingMoney !== null 
    ? selectedBookingMoney 
    : minBookingMoney;

  const handleBookNow = () => {
    if (propertyId !== property.id || selectedBookingMoney === null) {
      setBookingPlan(property.id, minBookingMoney, maxInstallments);
    }
    setIsPolicyOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative z-10">
        <div className="mb-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Price</p>
          <h2 className="text-3xl font-extrabold text-gray-900">৳ {propertyPrice.toLocaleString('en-IN')}</h2>
          <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${
            property.status === 'AVAILABLE' ? 'text-green-600' : property.status === 'BOOKED' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              property.status === 'AVAILABLE' ? 'bg-green-500' : property.status === 'BOOKED' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></span> {property.status === 'AVAILABLE' ? 'Available' : property.status === 'BOOKED' ? 'Booked' : 'Sold'}
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

          
          <button 
            onClick={handleBookNow}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <CalendarCheck size={20} />
            Book Now
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Booking amount: <span className="font-bold text-gray-900">৳ {displayBookingMoney.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Secure your unit instantly via Stripe.
          </p>
        </div>
      </div>

      
      <InstallmentCalculatorModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
        propertyId={property.id}
        totalPrice={propertyPrice}
        minBookingMoney={minBookingMoney}
        maxInstallments={maxInstallments}
      />
      
      <BookingPolicyModal 
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        propertyId={property.id!} 
      />
    </>
  );
}
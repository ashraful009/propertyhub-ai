import { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string; // ভবিষ্যতে নির্দিষ্ট প্রপার্টির পলিসি ফেচ করার জন্য
}

export default function BookingPolicyModal({ isOpen, onClose, propertyId }: PolicyModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    // পলিসি এগ্রি করার পর সরাসরি চেকআউট পেজে পাঠিয়ে দেবে
    navigate(`/checkout?property=${propertyId || 'demo-id'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-full flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Terms & Booking Policy</h3>
            <p className="text-sm text-gray-500">Please read carefully before proceeding</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-gray-600">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              1. Cancellation & Refunds
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              You can cancel your booking and request a refund within exactly <strong>1 month (30 days)</strong> of the booking date. After this period, the booking money becomes non-refundable.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              2. Refund Deductions
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              In the event of an approved cancellation and refund request within the 1-month window, a <strong>10% service and processing charge</strong> will be deducted from the total paid amount.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-red-600" /> 
              3. Default on Installments
            </h4>
            <p className="text-sm pl-6 border-l-2 border-red-100 ml-2 text-red-900 bg-red-50 p-3 rounded-lg">
              Failure to pay the agreed monthly installments for <strong>3 consecutive months</strong> without prior written notification will result in <strong>automatic cancellation</strong> of the booking. Previously paid amounts will be subject to the default penalty clauses.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              4. Transfer of Ownership
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              The booking cannot be transferred or sold to a third party until at least 50% of the total property value has been successfully paid off.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              5. Handover & Registration
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              Property handover and legal registration will only be initiated upon 100% clearance of the property value and any associated utility/maintenance charges.
            </p>
          </div>
        </div>

        {/* Footer with Checkbox and Action */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <label className="flex items-start gap-3 cursor-pointer group mb-4">
            <div className="relative flex items-center pt-0.5">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
              </div>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              I have read, understood, and agree to the Cancellation, Refund, and Default policies mentioned above.
            </span>
          </label>

          <button 
            onClick={handleProceed}
            disabled={!isAgreed}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              isAgreed 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Agree & Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
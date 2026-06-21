import { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorPolicyModal({ isOpen, onClose }: VendorPolicyModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    navigate('/vendor-application');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-full flex flex-col transform transition-all">
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Vendor Terms & Policies</h3>
            <p className="text-sm text-gray-500">Must read and agree before applying</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-gray-600">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              1. Platform Commission (Mandatory)
            </h4>
            <p className="text-sm pl-6 border-l-2 border-blue-200 ml-2 bg-blue-50/50 py-2 pr-2 rounded-r-lg text-blue-900 font-medium">
              PropertyHub will automatically deduct a strict <strong>5% commission</strong> from every installment or booking payment made by the customer before settling the amount to your vendor account.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              2. Document Authenticity
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              All submitted documents (TIN, BIN, Trade License, NID) must be 100% authentic. Any forged documents will result in immediate permanent account suspension and legal action.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              3. Payment Settlement
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              Cleared funds (after the 5% deduction) will be disbursed to the vendor's registered bank account within 3-5 business days of the customer's payment.
            </p>

            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" /> 
              4. Property Handover Commitment
            </h4>
            <p className="text-sm pl-6 border-l-2 border-gray-100 ml-2">
              Vendors are legally bound to hand over the property to the customer upon completion of the installment plan as per the agreed timeline.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <label className="flex items-start gap-3 cursor-pointer group mb-4">
            <div className="relative flex items-center pt-0.5">
              <input type="checkbox" className="peer sr-only" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
              </div>
            </div>
            <span className="text-sm text-gray-700 font-medium">
              I accept the 5% commission deduction policy and all other platform terms.
            </span>
          </label>

          <button 
            onClick={handleProceed}
            disabled={!isAgreed}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              isAgreed ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Agree & Open Application Form
          </button>
        </div>
      </div>
    </div>
  );
}
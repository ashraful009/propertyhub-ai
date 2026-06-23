import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="flex flex-col items-center">
          <XCircle className="w-20 h-20 text-red-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-500 mb-8">Your payment process was cancelled. No charges were made to your account.</p>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

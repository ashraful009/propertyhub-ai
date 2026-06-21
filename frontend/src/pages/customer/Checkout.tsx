import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, FileText, CreditCard, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // ভবিষ্যতে এগুলো Zustand store বা API থেকে আসবে
  const bookingMoney = 500000;
  const propertyName = "Luxury Oceanview Apartment";

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // ডামি পেমেন্ট প্রসেসিং (২ সেকেন্ড পর সাকসেস মেসেজ দেখাবে)
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment Successful! Booking Confirmed.');
      navigate('/customer/dashboard'); // পেমেন্ট শেষে কাস্টমার ড্যাশবোর্ডে যাবে
    }, 2000);
  };

  const formatBDT = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Property Details</span>
          <ChevronRight size={16} />
          <span>Policy Agreement</span>
          <ChevronRight size={16} />
          <span className="text-blue-600 font-bold">Checkout</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Complete Your Booking</h1>

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Forms & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80" 
                  alt="Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{propertyName}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-2">
                  <Building2 size={16} className="text-blue-500"/> Unit A-4 (2,450 sqft)
                </p>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  <CheckCircle2 size={16} /> Selected Plan: 5 Years Installment
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-blue-600" /> Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (As per NID)</label>
                  <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="+880 1..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">NID / Passport Number</label>
                  <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="1234567890" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Present Address</label>
                  <textarea required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Your full address..."></textarea>
                </div>
              </div>
            </div>

            {/* Nominee Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" /> Nominee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nominee Name</label>
                  <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                  <select required className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                    <option value="">Select Relation</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Payment & Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Property Price</span>
                  <span className="font-medium">{formatBDT(25000000)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Installment Duration</span>
                  <span className="font-medium">5 Years</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Monthly Installment</span>
                  <span className="font-medium">{formatBDT(408333)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Total to Pay Now<br/><span className="text-xs text-gray-500 font-normal">(Booking Money)</span></span>
                  <span className="text-2xl font-extrabold text-blue-600">{formatBDT(bookingMoney)}</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-bold text-gray-900 mb-3">Select Payment Method</p>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                    <CreditCard className={paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'} />
                    <span className={`font-medium ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-600'}`}>Credit / Debit Card</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'mobile' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" value="mobile" checked={paymentMethod === 'mobile'} onChange={() => setPaymentMethod('mobile')} className="sr-only" />
                    <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">bK</div>
                    <span className={`font-medium ${paymentMethod === 'mobile' ? 'text-blue-900' : 'text-gray-600'}`}>Mobile Banking</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : 'Confirm Booking & Pay'}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldAlert size={12} /> Secure encrypted payment
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
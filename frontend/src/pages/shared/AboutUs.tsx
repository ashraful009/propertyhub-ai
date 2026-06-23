import { Building2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About PropertyHub</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            PropertyHub is the leading platform for finding and managing real estate with flexible installment options. 
            We make property ownership accessible, transparent, and hassle-free for everyone. Whether you are looking 
            for your dream home, an office space, or an investment opportunity, PropertyHub connects you with the best 
            vendors and ensures a secure transaction process.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">10k+</h3>
              <p className="text-gray-500">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-500">Verified Vendors</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">15k+</h3>
              <p className="text-gray-500">Properties Listed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">PropertyHub</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm mb-4">
              Find your dream property with flexible installment options. We make real estate accessible and easy for everyone.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-2"><MapPin size={16}/> Dhaka, Bangladesh</span>
              <span className="flex items-center gap-2"><Phone size={16}/> +880 1234 567890</span>
              <span className="flex items-center gap-2"><Mail size={16}/> contact@propertyhub.com</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600">All Properties</Link></li>
              <li><Link to="/vendor-application" className="hover:text-blue-600">Become a Vendor</Link></li>
              <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 border-t border-gray-100 pt-8">
          © {new Date().getFullYear()} PropertyHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
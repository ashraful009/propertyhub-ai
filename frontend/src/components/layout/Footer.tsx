import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--indigo-900)] text-[var(--indigo-200)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 mb-12">
          
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-white/10 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">PropertyHub</span>
            </Link>
            <p className="text-[var(--indigo-200)] text-sm max-w-sm mb-6 leading-relaxed">
              Find your dream property with flexible installment options. We make real estate accessible and easy for everyone.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <span className="flex items-center gap-3"><MapPin size={18} className="text-[var(--indigo-400)]"/> Dhaka, Bangladesh</span>
              <span className="flex items-center gap-3"><Phone size={18} className="text-[var(--indigo-400)]"/> +880 1234 567890</span>
              <span className="flex items-center gap-3"><Mail size={18} className="text-[var(--indigo-400)]"/> contact@propertyhub.com</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link to="/vendor-application" className="hover:text-white transition-colors">Become a Vendor</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-[var(--indigo-700)] pt-8">
          © {new Date().getFullYear()} PropertyHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
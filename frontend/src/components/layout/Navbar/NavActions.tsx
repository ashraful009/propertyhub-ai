import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import VendorPolicyModal from '../../policy/VendorPolicyModal';
import { useAuthStore } from '../../../store/authStore';

export default function NavActions() {
  const [isVendorPolicyOpen, setIsVendorPolicyOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex items-center gap-6">
      <Link to="/properties" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
        Properties
      </Link>
      
      {/* Become a Vendor Button */}
      {user?.role !== 'ADMIN' && user?.role !== 'VENDOR' && (
        <button 
          onClick={() => setIsVendorPolicyOpen(true)}
          className="hidden md:block px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Become a Vendor
        </button>
      )}

      <ProfileDropdown />

      {/* Vendor Policy Modal */}
      <VendorPolicyModal 
        isOpen={isVendorPolicyOpen} 
        onClose={() => setIsVendorPolicyOpen(false)} 
      />
    </div>
  );
}
import { useAuthStore } from '../../store/authStore';
import CustomerProfile from '../../components/profile/CustomerProfile';
import VendorProfile from '../../components/profile/VendorProfile';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        {user.role === 'CUSTOMER' ? (
          <CustomerProfile />
        ) : user.role === 'VENDOR' ? (
          <VendorProfile />
        ) : null}
      </div>
    </div>
  );
}

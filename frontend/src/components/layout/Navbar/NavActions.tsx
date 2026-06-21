import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

export default function NavActions() {
  return (
    <div className="flex items-center gap-6">
      <Link to="/properties" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
        Properties
      </Link>
      <ProfileDropdown />
    </div>
  );
}
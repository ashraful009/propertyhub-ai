import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="p-2 bg-white/50 rounded-xl shadow-inner group-hover:bg-white/80 transition-all">
        <Building2 className="w-6 h-6 text-blue-600" />
      </div>
      <span className="font-bold text-xl tracking-tight text-gray-800">
        Property<span className="text-blue-600">Hub</span>
      </span>
    </Link>
  );
}
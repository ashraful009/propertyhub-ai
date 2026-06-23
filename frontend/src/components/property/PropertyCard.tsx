import { Link } from 'react-router-dom';
import { MapPin, Building } from 'lucide-react';
import type { IProperty } from '../../types/shared.types';

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link 
      to={`/properties/${property.id}`} 
      className="group relative w-full h-[320px] rounded-2xl overflow-hidden block transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
    >
      
      <img 
        src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} 
        alt={property.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-colors duration-300 group-hover:from-slate-900"></div>

      
      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end z-10">
        <h3 className="text-white font-bold text-lg sm:text-xl truncate mb-1">
          {property.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-300 text-xs sm:text-sm flex items-center gap-1.5">
            <MapPin size={14} className="text-blue-400" /> 
            <span className="truncate max-w-[120px] sm:max-w-[150px]">{property.location}</span>
          </p>
          
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1.5 rounded-lg border border-white/10">
            <Building size={12} />
            <span>{property.property_type ? property.property_type.toUpperCase() : 'PROPERTY'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
import { Link } from 'react-router-dom';
import { MapPin, Building, ShieldCheck, Sparkles } from 'lucide-react';
import type { IProperty } from '../../types/shared.types';

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Determine badges based on real data
  const isVerified = property.is_approved === true;
  
  // Consider it "New" if created within the last 30 days
  const isNew = property.created_at 
    ? (new Date().getTime() - new Date(property.created_at).getTime()) < (30 * 24 * 60 * 60 * 1000) 
    : false;

  return (
    <Link 
      to={`/properties/${property.id}`} 
      className="group relative w-full h-[480px] block glass-card overflow-hidden transition-all duration-300"
    >
      
      {property.images && property.images.length > 0 ? (
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[var(--indigo-100)] flex items-center justify-center">
          <span className="text-[var(--indigo-400)] font-medium">No Image</span>
        </div>
      )}
      
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isVerified && (
          <div className="flex items-center gap-1 bg-[var(--teal-50)] text-[var(--teal-800)] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md">
            <ShieldCheck size={14} />
            <span>Verified</span>
          </div>
        )}
        {isNew && (
          <div className="flex items-center gap-1 bg-[var(--amber-50)] text-[var(--amber-800)] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md">
            <Sparkles size={14} />
            <span>New</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--indigo-900)] via-[var(--indigo-900)]/40 to-transparent transition-colors duration-300 opacity-90 group-hover:opacity-100"></div>

      
      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end z-10">
        <h3 className="text-white font-bold text-lg sm:text-xl truncate mb-1">
          {property.title}
        </h3>
        
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-[var(--indigo-200)] text-xs sm:text-sm flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--amber-200)]" /> 
            <span className="truncate max-w-[120px] sm:max-w-[200px]">{property.location}</span>
          </p>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-[var(--amber-200)] font-extrabold">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(property.price)}
            </p>
            <div className="flex items-center gap-1 bg-[var(--indigo-50)] text-[var(--indigo-700)] text-xs font-bold px-2 py-1 rounded-md border border-[var(--border-color)]">
              <Building size={12} />
              <span>{property.property_type ? property.property_type.toUpperCase() : 'PROPERTY'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
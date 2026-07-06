import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import type { IProperty } from '../../types/shared.types';

export default function PropertyInfo({ property }: { property: IProperty }) {
  return (
    <div className="glass-card p-6 sm:p-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--indigo-900)] mb-2">
          {property.title}
        </h1>
        <p className="text-[var(--text-secondary)] flex items-center gap-2 text-lg">
          <MapPin className="text-[var(--indigo-400)]" size={20} />
          {property.address}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-y border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--indigo-50)] text-[var(--indigo-500)] rounded-xl"><BedDouble size={24} /></div>
          <div>
            <p className="font-semibold text-[var(--indigo-900)]">{property.bedrooms ? property.bedrooms : 'N/A'} Bedrooms</p>
            <p className="text-sm text-[var(--text-muted)]">Spacious</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--indigo-50)] text-[var(--indigo-500)] rounded-xl"><Bath size={24} /></div>
          <div>
            <p className="font-semibold text-[var(--indigo-900)]">{property.bathrooms ? property.bathrooms : 'N/A'} Bathrooms</p>
            <p className="text-sm text-[var(--text-muted)]">Modern fittings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--indigo-50)] text-[var(--indigo-500)] rounded-xl"><Square size={24} /></div>
          <div>
            <p className="font-semibold text-[var(--indigo-900)]">{property.area ? Number(property.area).toLocaleString() : 'N/A'} sqft</p>
            <p className="text-sm text-[var(--text-muted)]">Floor area</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[var(--indigo-900)] mb-4">Description</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {property.description}
        </p>
      </div>
    </div>
  );
}
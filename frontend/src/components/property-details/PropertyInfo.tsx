import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import type { IProperty } from '../../types/shared.types';

export default function PropertyInfo({ property }: { property: IProperty }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          {property.title}
        </h1>
        <p className="text-gray-500 flex items-center gap-2 text-lg">
          <MapPin className="text-blue-600" size={20} />
          {property.address}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BedDouble size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">{property.bedrooms} Bedrooms</p>
            <p className="text-sm text-gray-500">Spacious</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Bath size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">{property.bathrooms} Bathrooms</p>
            <p className="text-sm text-gray-500">Modern fittings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Square size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">{Number(property.area).toLocaleString()} sqft</p>
            <p className="text-sm text-gray-500">Floor area</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-600 leading-relaxed">
          {property.description}
        </p>
      </div>


    </div>
  );
}
import { useState } from 'react';
import { LOCATIONS } from '../../utils/constants';

export interface IPropertyFilters {
  location?: string;
  property_type?: string;
  maxPrice?: string;
}

interface PropertyFilterProps {
  onFilter: (filters: IPropertyFilters) => void;
}

export default function PropertyFilter({ onFilter }: PropertyFilterProps) {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('100000000'); // 10 Crore BDT default

  const handleApply = () => {
    const filters: IPropertyFilters = {};
    if (location) filters.location = location;
    if (propertyType) filters.property_type = propertyType;
    if (maxPrice && parseInt(maxPrice) < 100000000) filters.maxPrice = maxPrice;
    
    onFilter(filters);
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 text-lg mb-6">Filter Properties</h3>
      
      <div className="space-y-5">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Property Type</label>
          <select 
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial Space</option>
            <option value="land">Land / Plot</option>
            <option value="villa">Villa / Duplex</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Price Range</label>
          <input 
            type="range" 
            min="0" 
            max="100000000" 
            step="1000000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 BDT</span>
            <span>Up to {parseInt(maxPrice).toLocaleString()} BDT</span>
          </div>
        </div>

        <button 
          onClick={handleApply}
          className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors mt-4"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
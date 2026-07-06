import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [maxPrice, setMaxPrice] = useState('100000000');
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    const filters: IPropertyFilters = {};
    if (location) filters.location = location;
    if (propertyType) filters.property_type = propertyType;
    if (maxPrice && parseInt(maxPrice) < 100000000) filters.maxPrice = maxPrice;
    
    onFilter(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="md:sticky md:top-28">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between p-4 mb-4 glass-card text-[var(--indigo-900)] font-bold"
      >
        <span className="flex items-center gap-2"><Filter size={20}/> Filters</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block glass-card p-6`}>
        <h3 className="font-bold text-[var(--indigo-900)] text-lg mb-6 hidden md:block">Filter Properties</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[var(--indigo-50)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--indigo-400)] transition-all text-sm appearance-none text-[var(--text-primary)]"
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Property Type</label>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-[var(--indigo-50)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--indigo-400)] transition-all text-sm appearance-none text-[var(--text-primary)]"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="commercial">Commercial Space</option>
              <option value="land">Land / Plot</option>
              <option value="villa">Villa / Duplex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Price Range</label>
            <input 
              type="range" 
              min="0" 
              max="100000000" 
              step="1000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-[var(--indigo-500)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
              <span>0 BDT</span>
              <span>Up to {parseInt(maxPrice).toLocaleString()} BDT</span>
            </div>
          </div>

          <button 
            onClick={handleApply}
            className="w-full bg-[var(--indigo-900)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--indigo-700)] transition-colors mt-4"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
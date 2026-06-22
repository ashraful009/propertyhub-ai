import { useState, useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import PropertyFilter from '../../components/home/PropertyFilter';
import PropertyCard from '../../components/property/PropertyCard';
import { PropertyService } from '../../services/property.service';
import type { IProperty } from '../../types/shared.types';
import type { IPropertyFilters } from '../../components/home/PropertyFilter';

export default function Home() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IPropertyFilters>({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.searchProperties(filters);
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilter = (newFilters: IPropertyFilters) => {
    setFilters(newFilters);
  };
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 2. Left Side Filter (Sticky on Desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <PropertyFilter onFilter={handleFilter} />
            </div>
          </div>

          {/* 3. Right Side Property Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                Showing {properties.length} results
              </span>
            </div>

            {/* Grid Container: Max 6 roughly visible, then scrollable internally */}
            <div className="h-[800px] overflow-y-auto pr-2 pb-10 custom-scrollbar">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading properties...</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-lg font-bold">No properties found</p>
                  <p className="text-sm">We couldn't find any approved properties at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
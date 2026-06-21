import HeroSection from '../../components/home/HeroSection';
import PropertyFilter from '../../components/home/PropertyFilter';
import PropertyCard from '../../components/property/PropertyCard';

// Dummy data for testing the grid
const dummyProperties = Array(10).fill(null).map((_, i) => ({
  id: `prop-${i}`,
  title: `Luxury Apartment ${i + 1}`,
  location: i % 2 === 0 ? "Gulshan, Dhaka" : "Banani, Dhaka",
  image: `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80`,
  availableUnits: Math.floor(Math.random() * 10) + 1,
}));

export default function Home() {
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
              <PropertyFilter />
            </div>
          </div>

          {/* 3. Right Side Property Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                Showing {dummyProperties.length} results
              </span>
            </div>

            {/* Grid Container: Max 6 roughly visible, then scrollable internally */}
            <div className="h-[800px] overflow-y-auto pr-2 pb-10 custom-scrollbar">
              {/* Mobile: 2 cols, Desktop: 3 cols */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {dummyProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
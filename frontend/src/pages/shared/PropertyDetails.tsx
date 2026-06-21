import ImageGallery from '../../components/property-details/ImageGallery';
import PropertyInfo from '../../components/property-details/PropertyInfo';
import MapSection from '../../components/property-details/MapSection';
import BookingCard from '../../components/property-details/BookingCard';

export default function PropertyDetails() {

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImageGallery />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <PropertyInfo />
              <MapSection />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ImageGallery from '../../components/property-details/ImageGallery';
import PropertyInfo from '../../components/property-details/PropertyInfo';
import MapSection from '../../components/property-details/MapSection';
import BookingCard from '../../components/property-details/BookingCard';
import ChatButton from '../../components/property-details/ChatButton';
import AIChatPanel from '../../components/property-details/AIChatPanel';
import { usePropertyDetails } from '../../hooks/api/useProperties';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = usePropertyDetails(id || '');
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-xl text-gray-600 font-medium">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImageGallery images={property.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <PropertyInfo property={property} />
              <MapSection />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingCard property={property} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
      <AIChatPanel isOpen={isChatOpen} property={property} />
    </div>
  );
}
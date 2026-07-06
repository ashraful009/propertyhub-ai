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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <Loader2 className="w-8 h-8 text-[var(--indigo-500)] animate-spin" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <p className="text-xl text-[var(--text-secondary)] font-medium">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* 80% width container */}
      <div className="w-full lg:w-[80%] mx-auto flex flex-col lg:flex-row py-8 lg:py-12 gap-8 lg:gap-0">
        
        {/* Left Side: 40% width, sticky with offset and reduced height */}
        <div className="lg:w-[40%] lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">
          <ImageGallery images={property.images} />
        </div>

        {/* Right Side: 60% width, scrollable content */}
        <div className="lg:w-[60%] flex flex-col gap-6 px-4 lg:px-12 pb-12">
          <PropertyInfo property={property} />
          <BookingCard property={property} />
          <MapSection property={property} />
        </div>
      </div>

      {/* AI Chat */}
      <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
      <AIChatPanel isOpen={isChatOpen} property={property} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
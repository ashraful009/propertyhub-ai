import { useState } from 'react';

const PropertyBottomGallery = ({ title, allImages }) => {
  const [startIndex, setStartIndex] = useState(1); // main image is 0, rest are from 1
  const galleryImages = allImages.length > 1 ? allImages.slice(1) : [];

  const handleNext = () => {
    if (startIndex + 4 <= galleryImages.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  const handlePrev = () => {
    if (startIndex - 4 >= 1) {
      setStartIndex((prev) => prev - 4);
    } else {
      setStartIndex(1);
    }
  };

  if (allImages.length === 0) return null;

  return (
    <div className="container-main py-12 border-t border-gray-200 mt-12">
      <h2 className="text-3xl font-blackops text-gray-900 mb-8">Photo Gallery</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 items-stretch h-[600px]" style={{ perspective: '1200px' }}>
        {/* Left Side: Main Building Image in a 3D Card */}
        <div className="flex-1 relative h-[400px] lg:h-full group">
          <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out hover:[transform:rotateY(6deg)_rotateX(4deg)_scale(1.02)] border-[8px] border-white">
            <img 
              src={allImages[0]} 
              alt={`${title} Main`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </div>

        {/* Right Side: Grid of 4 images with navigation arrows if needed */}
        {galleryImages.length > 0 && (
          <div className="flex-1 flex flex-col justify-center h-[400px] lg:h-full relative">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {galleryImages.slice(startIndex - 1, startIndex - 1 + 4).map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden shadow-sm group border-4 border-white">
                  <img 
                    src={img} 
                    alt={`Gallery ${i}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {galleryImages.length > 4 && (
              <>
                <button 
                  onClick={handlePrev}
                  disabled={startIndex === 1}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-blue-50 disabled:opacity-0 disabled:cursor-not-allowed transition-all z-10 border border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  disabled={startIndex - 1 + 4 >= galleryImages.length}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-blue-50 disabled:opacity-0 disabled:cursor-not-allowed transition-all z-10 border border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBottomGallery;

export default function ImageGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return (
      <div className="grid grid-cols-1 h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-lg font-medium">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] lg:h-full group">
      {/* Main Full-Height Image */}
      <img 
        src={images[0]} 
        alt="Main" 
        className="w-full h-full object-cover rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform duration-700" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-3xl pointer-events-none"></div>
      
      {/* Floating Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.slice(1, 5).map((img, index) => (
            <div 
              key={index} 
              className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg cursor-pointer hover:border-white transition-colors"
            >
              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
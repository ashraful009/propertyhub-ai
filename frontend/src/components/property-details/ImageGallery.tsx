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
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
      <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
        <img src={images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
      </div>
      {images.slice(1).map((img, index) => (
        <div key={index} className="hidden md:block relative group cursor-pointer overflow-hidden">
          <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
      ))}
    </div>
  );
}
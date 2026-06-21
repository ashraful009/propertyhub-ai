export default function ImageGallery() {
  const images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687931-cece5ce21fac?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  ];

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
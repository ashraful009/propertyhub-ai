import { Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Mansion" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
          Discover Your <span className="text-blue-400">Perfect Place</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Explore premium properties with flexible installment plans tailored just for you.
        </p>

        {/* Global Search Bar (Center) */}
        <div className="flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 w-full max-w-2xl mx-auto shadow-2xl">
          <input 
            type="text" 
            placeholder="Search by city, area, or property name..." 
            className="flex-1 bg-transparent text-white placeholder-gray-200 px-4 py-2 outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
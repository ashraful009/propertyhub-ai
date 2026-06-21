import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="hidden md:flex items-center relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search locations, properties..."
        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/40 border border-white/50 focus:outline-none focus:bg-white/80 focus:ring-2 focus:ring-blue-500/30 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] transition-all text-gray-700 placeholder-gray-500"
      />
      <Search className="absolute left-4 w-5 h-5 text-gray-400" />
    </div>
  );
}
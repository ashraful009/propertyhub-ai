import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex items-center relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search locations, properties..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[var(--surface-glass)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo-400)] transition-all text-[var(--text-primary)] placeholder-[var(--text-muted)]"
        />
        <Search className="absolute left-4 w-5 h-5 text-[var(--text-muted)]" />
      </div>

      {/* Mobile Search Icon */}
      <button 
        className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--indigo-900)] transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Search size={24} />
      </button>

      {/* Mobile Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-base)] p-4 flex flex-col md:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Search locations, properties..."
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo-400)] text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 text-[var(--text-secondary)] hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
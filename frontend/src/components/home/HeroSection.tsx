import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import apiClient from '../../config/axios';

interface TrustStats {
  totalProperties: number;
  happyClients: number;
  verifiedVendors: number;
}

export default function HeroSection() {
  const [stats, setStats] = useState<TrustStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get('/properties/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--bg-hero-start)] to-[var(--bg-hero-end)] px-4">
      
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--indigo-900)] mb-6 tracking-tight">
          Discover Your <span className="text-[var(--indigo-400)]">Perfect Place</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
          Explore premium properties with flexible installment plans tailored just for you.
        </p>
        
        <div className="glass-card p-2 w-full max-w-[440px] mx-auto flex items-center shadow-lg">
          <input 
            type="text" 
            placeholder="Search by city, area, or property name..." 
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] px-4 py-2 outline-none"
          />
          <button className="bg-[var(--indigo-900)] hover:bg-[var(--indigo-700)] text-white rounded-xl p-3 transition-colors flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>

        {stats && (
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto text-center">
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-[var(--indigo-900)] mb-1">{stats.totalProperties}+</p>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium">Total Properties</p>
            </div>
            <div className="border-x border-[var(--border-color)]">
              <p className="text-3xl md:text-4xl font-extrabold text-[var(--indigo-900)] mb-1">{stats.happyClients}+</p>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold text-[var(--indigo-900)] mb-1">{stats.verifiedVendors}+</p>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium">Verified Vendors</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
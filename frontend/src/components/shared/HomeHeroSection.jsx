import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/right hreo image.jpg';

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal'];

const HomeHeroSection = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`);
  };

  const handleCityClick = (city) => {
    navigate(`/properties?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-10 right-10 w-96 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-800/10 rounded-full blur-3xl" />

      <div className="container-main relative z-10 py-16 sm:py-20 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="flex-1 max-w-3xl animate-slideUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 bg-primary-500/10 border border-primary-500/20">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-primary-600 text-xs sm:text-sm md:text-base font-medium">
              Bangladesh's #1 Real Estate Marketplace
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-4 sm:mb-6 leading-none tracking-tight">
            Find Your<br />
            <span className="text-gradient">Perfect Home</span><br />
            in Bangladesh
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 max-w-xl leading-relaxed">
            Browse thousands of verified properties from trusted companies.
            Apartments, villas, land — all in one place.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="form-input pl-10 text-sm sm:text-base"
                placeholder="Search by city (e.g. Dhaka)"
              />
            </div>
            <button type="submit" className="btn-primary px-6 sm:px-8 whitespace-nowrap text-sm sm:text-base">
              Search Properties
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-xs sm:text-sm self-center">Popular:</span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs sm:text-sm hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 justify-end items-center relative w-full" style={{ perspective: '1200px' }}>
          <div className="relative w-[90%] max-w-[600px] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(8,112,184,0.3)] transition-transform duration-500 ease-out hover:[transform:rotateY(-8deg)_rotateX(5deg)_scale(1.02)] border-[6px] border-white group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent z-10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <img 
              src={heroImage} 
              alt="Modern Home" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default HomeHeroSection;

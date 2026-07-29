import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import PropertyCard from '../../components/shared/PropertyCard';
import PropertyCardSkeleton from '../../components/shared/PropertyCardSkeleton';
import HomeHeroSection from '../../components/shared/HomeHeroSection';


const CATEGORIES = [
  { key: 'apartment',  icon: '', label: 'Apartments', gradient: 'from-blue-600/25 to-blue-900/20',   border: 'hover:border-blue-500/40'  },
  { key: 'villa',      icon: '', label: 'Villas',     gradient: 'from-pink-600/25 to-pink-900/20',   border: 'hover:border-pink-500/40'  },
  { key: 'land',       icon: '', label: 'Land',       gradient: 'from-green-600/25 to-green-900/20', border: 'hover:border-green-500/40' },
];

const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          setCount(Math.floor(current));
          if (current >= target) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const StatItem = ({ target, suffix = '+', label }) => {
  const { count, ref } = useCounter(target);
  return (
    <div ref={ref} className="text-center bg-white border border-blue-100 shadow-sm rounded-xl py-6 px-4">
      <p className="text-3xl sm:text-4xl font-bold text-blue-600">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();


  const [properties,   setProperties]   = useState([]);
  const [propLoading,  setPropLoading]  = useState(true);

  useEffect(() => {
    axiosInstance.get('/properties/approved?limit=6')
      .then((r) => setProperties(r.data.data.properties))
      .catch(() => setProperties([]))
      .finally(() => setPropLoading(false));
  }, []);


  const handleCategory = (cat) => {
    navigate(`/properties?category=${cat}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <HomeHeroSection />

      {}
      <section className="border-y border-slate-100 bg-slate-100">
        <div className="container-main py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatItem target={500}  suffix="+"  label="Properties Listed"  />
            <StatItem target={120}  suffix="+"  label="Verified Companies"  />
            <StatItem target={5000} suffix="+"  label="Happy Customers"     />
            <StatItem target={25}   suffix="+"  label="Cities Covered"      />
          </div>
        </div>
      </section>

      {}
      <section className="py-16">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">Browse by Category</h2>
            <p className="text-gray-500">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {CATEGORIES.map(({ key, icon, label, gradient, border }) => (
              <button
                key={key}
                onClick={() => handleCategory(key)}
                className={`group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl
                  border border-blue-100 bg-gradient-to-br ${gradient}
                  ${border} hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <span className="text-3xl sm:text-4xl group-hover:scale-110
                                 transition-transform duration-300">
                  {icon}
                </span>
                <span className="text-gray-900 font-semibold text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-slate-100">
        <div className="container-main">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Featured Properties</h2>
              <p className="text-gray-500">Handpicked listings from verified companies</p>
            </div>
            <Link to="/properties"
              className="text-primary-600 hover:text-primary-600 text-sm font-medium
                         flex items-center gap-1 transition-colors flex-shrink-0">
              View all →
            </Link>
          </div>

          {propLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="glass-card py-16 text-center">
              
              <p className="text-gray-900 font-semibold">No properties yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Check back soon — companies are listing properties daily.
              </p>
            </div>
          )}

          {!propLoading && properties.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/properties" className="btn-secondary inline-flex">
                Browse All Properties →
              </Link>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-20">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-3xl
                          bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-dark-800
                          border border-primary-500/20 p-8 sm:p-12 text-center">
            {}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10
                            rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10
                            rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative">
              
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Are you a Real Estate Company?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                Join 120+ verified companies already selling on FlatSell.
                List your properties and reach thousands of verified buyers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary px-8 py-3">
                  Get Started — It&apos;s Free
                </Link>
                <Link to="/become-vendor" className="btn-secondary px-8 py-3">
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

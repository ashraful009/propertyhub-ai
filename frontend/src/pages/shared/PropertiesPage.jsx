import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import PropertyCard from '../../components/shared/PropertyCard';
import PropertyCardSkeleton from '../../components/shared/PropertyCardSkeleton';
import Pagination from '../../components/shared/Pagination';

const CATEGORIES = [
  { value: '', label: 'All Types' },
  { value: 'apartment',  label: 'Apartments'  },
  { value: 'villa',      label: 'Villas'       },
  { value: 'land',       label: 'Land'         },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First'       },
  { value: 'price-asc',  label: 'Price: Low → High'  },
  { value: 'price-desc', label: 'Price: High → Low'  },
];

const LIMIT = 12;

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [city,     setCity]     = useState(searchParams.get('city')     || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || 'newest');
  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1);

  const [properties, setProperties] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const applyFilters = useCallback((newFilters = {}) => {
    const merged = { city, category, sort, page: 1, ...newFilters };
    const params = {};
    if (merged.city)     params.city     = merged.city;
    if (merged.category) params.category = merged.category;
    if (merged.sort && merged.sort !== 'newest') params.sort = merged.sort;
    if (merged.page > 1) params.page = merged.page;
    setSearchParams(params);
    setCity(merged.city || '');
    setCategory(merged.category || '');
    setSort(merged.sort || 'newest');
    setPage(Number(merged.page) || 1);
  }, [city, category, sort, setSearchParams]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setProperties([]);
    try {
      const q = new URLSearchParams({ limit: LIMIT, page });
      if (city)     q.set('city', city);
      if (category) q.set('category', category);

      const { data } = await axiosInstance.get(`/properties/approved?${q}`);
      let props = data.data.properties;

      if (sort === 'price-asc')  props = [...props].sort((a, b) => a.price - b.price);
      if (sort === 'price-desc') props = [...props].sort((a, b) => b.price - a.price);

      setProperties(props);
      setTotal(data.data.total);
    } catch {
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [city, category, sort, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const totalPages = Math.ceil(total / LIMIT);

  const FilterContent = () => (
    <div className="space-y-6">
      {}
      <div>
        <label className="form-label">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters({ city: e.target.value })}
          className="form-input"
          placeholder="e.g. Dhaka"
        />
      </div>

      {}
      <div>
        <label className="form-label">Property Type</label>
        <div className="space-y-1.5 mt-2">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => applyFilters({ category: value })}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all
                ${category === value
                  ? 'bg-primary-500/20 border border-primary-500/40 text-primary-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-slate-50 border border-transparent'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {}
      <div>
        <label className="form-label">Sort By</label>
        <select
          value={sort}
          onChange={(e) => applyFilters({ sort: e.target.value })}
          className="form-input mt-1"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {}
      {(city || category || sort !== 'newest') && (
        <button
          onClick={() => applyFilters({ city: '', category: '', sort: 'newest', page: 1 })}
          className="w-full py-2 text-sm text-red-600 hover:text-red-300
                     hover:bg-red-500/10 rounded-xl transition-colors"
        >
           Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-main">

        {}
        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <h1 className="section-title mb-1">
                {category
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)}s`
                  : 'All Properties'}
                {city && <span className="text-gray-500 font-normal"> in {city}</span>}
              </h1>

            </div>

            {}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="sm:hidden flex items-center gap-2 btn-secondary text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0
                     01-1.447.894l-4-2A1 1 0 017 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {(city || category || sort !== 'newest') && (
                <span className="w-2 h-2 bg-primary-400 rounded-full" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">

          {}
          <aside className="hidden sm:block w-56 flex-shrink-0">
            <div className="glass-card p-5 sticky top-20">
              <h2 className="text-gray-900 font-semibold mb-5 text-sm uppercase tracking-wider">
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {}
          <div className="flex-1 min-w-0">
            {}


            {}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(LIMIT)].map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>
            ) : (
              <div className="glass-card py-20 text-center">
                
                <p className="text-gray-900 font-semibold mb-1">No properties found</p>
                <p className="text-gray-500 text-sm mb-5">
                  Try adjusting your filters or clearing them.
                </p>
                <button
                  onClick={() => applyFilters({ city: '', category: '', sort: 'newest', page: 1 })}
                  className="btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => applyFilters({ page: p })}
            />
          </div>
        </div>
      </div>

      {}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 sm:hidden animate-fadeIn"
             onClick={(e) => e.target === e.currentTarget && setMobileFilterOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl
                          p-6 pb-10 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-bold">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-blue-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => { applyFilters(); setMobileFilterOpen(false); }}
              className="btn-primary w-full mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;

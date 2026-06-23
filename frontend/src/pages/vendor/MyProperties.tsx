import { useState, useEffect } from 'react';
import { VendorService } from '../../services/vendor.service';
import type { IProperty } from '../../types/shared.types';
import { Edit, Trash2, MapPin, DollarSign, Maximize, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function MyProperties() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await VendorService.getProperties();
      setProperties(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;

    try {
      await VendorService.deleteProperty(id);
      toast.success('Property deleted successfully');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to delete property');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
        <Link 
          to="/vendor/add-property" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add New
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-700">No Properties Found</h3>
          <p className="text-gray-500 mt-2">You haven't added any properties yet.</p>
          <Link 
            to="/vendor/add-property" 
            className="inline-block mt-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-2.5 rounded-xl font-semibold transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                    property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    property.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                    property.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.is_approved ? 'APPROVED' : 'PENDING APPROVAL'}
                  </div>
                </div>

                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => navigate(`/vendor/edit-property/${property.id}`)}
                    className="bg-white text-gray-800 p-3 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-lg"
                    title="Edit Property"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(property.id)}
                    className="bg-white text-red-600 p-3 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                    title="Delete Property"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin size={14} />
                    <span className="truncate">{property.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Price</p>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <DollarSign size={14} className="text-indigo-600" />
                      {property.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{property.property_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Bed/Bath</p>
                    <p className="font-semibold text-gray-900 truncate">{property.bedrooms} Beds / {property.bathrooms} Baths</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Size</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Maximize size={14} className="text-indigo-600" />
                      {property.area} sqft
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

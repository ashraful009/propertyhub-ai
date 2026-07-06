import { useState, useEffect } from 'react';
import { AdminService } from '../../services/admin.service';
import type { IProperty } from '../../types/shared.types';
import { Check, X, MapPin, Banknote, Home, Maximize } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyRequests() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getPendingProperties();
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

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this property?`)) return;

    try {
      setProcessingId(id);
      await AdminService.reviewPropertyRequest(id, status);
      toast.success(`Property ${status.toLowerCase()} successfully`);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || `Failed to ${status.toLowerCase()} property`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pending Property Requests</h1>
        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
          {properties.length} Pending
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No Pending Requests</h3>
          <p className="text-gray-500 mt-2">All properties have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  PENDING REVIEW
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin size={14} />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {property.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Price</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Banknote size={14} className="text-indigo-600" />
                      ৳{property.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{property.property_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Vendor</p>
                    <p className="font-semibold text-gray-900 truncate">{property.vendor_name || 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Size</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <Maximize size={14} className="text-indigo-600" />
                      {property.area} sqft
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleReview(property.id, 'APPROVED')}
                    disabled={processingId === property.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors"
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button
                    onClick={() => handleReview(property.id, 'REJECTED')}
                    disabled={processingId === property.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-medium py-2.5 rounded-xl transition-colors"
                  >
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

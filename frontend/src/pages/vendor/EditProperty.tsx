import { useState, useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { 
  Building, MapPin, Banknote, UploadCloud, 
  List, Save, X, BedDouble, Bath, Square, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { VendorService } from '../../services/vendor.service';
import { LOCATIONS } from '../../utils/constants';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async (propertyId: string) => {
      try {
        setLoading(true);
        const property = await VendorService.getPropertyById(propertyId);
        

        reset({
          title: property.title,
          type: property.property_type,
          location: property.location,
          description: property.description,
          totalPrice: property.price,
          area: property.area,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,

          bookingMoney: Math.floor(property.price * 0.1),
          maxDuration: "5"
        });
        setExistingImages(property.images || []);
      } catch {
        toast.error('Failed to load property details');
        navigate('/vendor/properties');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty(id);
  }, [id, reset, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };



  const onSubmit = async (data: FieldValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('property_type', data.type);
      formData.append('location', data.location);
      formData.append('address', data.location);
      formData.append('description', data.description);
      formData.append('price', data.totalPrice);
      formData.append('area', data.area);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms);
      

      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      } else {


      }

      await VendorService.updateProperty(id as string, formData);
      
      toast.success('Property updated successfully!');
      navigate('/vendor/properties');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading property details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/vendor/properties" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-500">Update your property details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Building className="text-indigo-600" size={20} /> Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title</label>
            <input 
              type="text" 
              {...register("title", { required: true })} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type</label>
              <select {...register("type", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50">
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial Space</option>
                <option value="land">Land / Plot</option>
                <option value="villa">Villa / Duplex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location / Area</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select 
                  {...register("location", { required: true })} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50 appearance-none" 
                >
                  <option value="">Select Location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description</label>
            <textarea 
              rows={4} 
              {...register("description", { required: true })} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50 custom-scrollbar" 
            ></textarea>
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <List className="text-indigo-600" size={20} /> Specifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><Square size={16}/> Total Area (sqft)</label>
              <input type="number" {...register("area", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><BedDouble size={16}/> Bedrooms</label>
              <input type="number" {...register("bedrooms", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><Bath size={16}/> Bathrooms</label>
              <input type="number" {...register("bathrooms", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" />
            </div>
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Banknote className="text-indigo-600" size={20} /> Pricing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Property Value (BDT)</label>
              <input type="number" {...register("totalPrice", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" />
            </div>
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <UploadCloud className="text-indigo-600" size={20} /> Property Images
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <UploadCloud className="mx-auto text-gray-400 mb-4" size={40} />
            <p className="text-sm font-medium text-gray-700">Add new images</p>
            <p className="text-xs text-gray-400 mt-1">Uploading new images will replace existing ones (backend logic constraint for now)</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            
            {existingImages.map((url, index) => (
              <div key={`exist-${index}`} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Existing</div>
              </div>
            ))}
            
            
            {images.map((file, index) => (
              <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden border border-indigo-200 aspect-square">
                <img src={URL.createObjectURL(file)} alt={`New ${index}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">New</div>
                <button 
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <div className="flex gap-4 sticky bottom-6 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <button type="button" onClick={() => navigate('/vendor/properties')} className="px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-700">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? 'Updating...' : <><Save size={20} /> Update Property</>}
          </button>
        </div>

      </form>
    </div>
  );
}

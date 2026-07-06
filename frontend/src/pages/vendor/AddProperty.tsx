import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { 
  Building, MapPin, Banknote, UploadCloud, 
  List, Save, X, BedDouble, Bath, Square
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCreateProperty } from '../../hooks/api/useVendor';
import { LOCATIONS } from '../../utils/constants';

export default function AddProperty() {
  const { register, handleSubmit } = useForm();
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const { mutateAsync: createProperty, isPending: isSubmitting } = useCreateProperty();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FieldValues) => {
    if (images.length === 0) {
      toast.error('Please upload at least one property image.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('property_type', data.type);
      formData.append('location', data.location);
      formData.append('address', data.location);
      formData.append('description', data.description);
      formData.append('price', data.totalPrice);
      formData.append('booking_money', data.bookingMoney);
      formData.append('total_installments', String(Number(data.maxDuration) * 12));
      

      formData.append('area', data.area);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms);

      images.forEach((image) => {
        formData.append('images', image);
      });

      await createProperty(formData);
      
      toast.success('Property submitted successfully!');
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Failed to create property', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-500">List your property with installment details for admin review.</p>
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
              placeholder="e.g. Luxury Oceanview Apartment" 
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
              placeholder="Describe the property, neighborhood, and highlights..."
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
              <input type="number" {...register("area", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" placeholder="e.g. 2450" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><BedDouble size={16}/> Bedrooms</label>
              <input type="number" {...register("bedrooms", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1"><Bath size={16}/> Bathrooms</label>
              <input type="number" {...register("bathrooms", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" placeholder="3" />
            </div>
          </div>
        </div>

        
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Banknote className="text-indigo-600" size={20} /> Pricing & Installment Setup
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Property Value (BDT)</label>
              <input type="number" {...register("totalPrice", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" placeholder="e.g. 25000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Booking Money (BDT)</label>
              <input type="number" {...register("bookingMoney", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50" placeholder="e.g. 500000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Installment Duration</label>
              <select {...register("maxDuration", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none bg-gray-50">
                <option value="1">1 Year (12 Months)</option>
                <option value="3">3 Years (36 Months)</option>
                <option value="5">5 Years (60 Months)</option>
                <option value="10">10 Years (120 Months)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Customers can choose any plan up to this maximum duration.</p>
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
            <p className="text-sm font-medium text-gray-700">Click or drag images here to upload</p>
            <p className="text-xs text-gray-400 mt-1">High resolution images recommended (Max 5MB each)</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {images.map((file, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                  <img src={URL.createObjectURL(file)} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="flex gap-4 sticky bottom-6 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <button type="button" onClick={() => navigate('/vendor/dashboard')} className="px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-700">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? 'Submitting to Admin...' : <><Save size={20} /> Submit Property for Approval</>}
          </button>
        </div>

      </form>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

export default function VendorProfile() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      company_name: '',
      location: '',
      full_address: '',
      company_mail: '',
      vendor_phone: ''
    }
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profile');
        const data = response.data.data;
        const vendor = data.vendor || {};
        
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          company_name: vendor.company_name || '',
          location: vendor.location || '',
          full_address: vendor.full_address || '',
          company_mail: vendor.company_mail || '',
          vendor_phone: vendor.phone || ''
        });
        
        if (data.profile_photo) {
          setPhotoPreview(data.profile_photo);
          setUser({ ...user!, profile_photo: data.profile_photo, name: data.name });
        }
      } catch (error) {
        console.error('Failed to fetch vendor profile', error);
      }
    };
    fetchProfile();
  }, [reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Record<string, string | Blob>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('company_name', data.company_name);
      formData.append('location', data.location);
      formData.append('full_address', data.full_address);
      formData.append('company_mail', data.company_mail);
      formData.append('vendor_phone', data.vendor_phone);
      
      if (selectedFile) {
        formData.append('profile_photo', selectedFile);
      }

      const response = await apiClient.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedData = response.data.data;
      toast.success('Vendor profile updated successfully!');
      
      setUser({
        ...user!,
        name: updatedData.name,
        profile_photo: updatedData.profile_photo,
        phone: updatedData.phone,
        address: updatedData.address,
      });

    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update vendor profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-gray-100">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h3 className="text-lg font-bold text-gray-900">Vendor Profile Photo</h3>
              <p className="text-sm text-gray-500">Upload a professional photo for your vendor profile.</p>
            </div>
          </div>

          
          <div>
            <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Email</label>
                <input
                  type="email"
                  {...register('email')}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Address</label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          
          <div>
            <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Business Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  {...register('company_name', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                <input
                  type="email"
                  {...register('company_mail')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                <input
                  type="tel"
                  {...register('vendor_phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Location</label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Business Address</label>
                <textarea
                  {...register('full_address')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

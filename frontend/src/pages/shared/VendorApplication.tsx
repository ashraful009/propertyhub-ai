import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Building2, CheckCircle2, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react';
// import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSubmitVendorApplication } from '../../hooks/api/useVendor';

export default function VendorApplication() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();
  const navigate = useNavigate();
  const { mutateAsync: submitApplication, isPending: isSubmitting } = useSubmitVendorApplication();

  // 5MB Custom Validation Rule
  const validateFile = (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return "File is required";
    const file = fileList[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) return "File size cannot exceed 5MB";
    return true;
  };

  const handleNextStep = async () => {
    // Validate Step 1 fields before moving to Step 2
    const isValid = await trigger(["fullName", "phone", "email", "nidNumber", "profileImage", "nidScan"]);
    if (isValid) setStep(2);
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const formData = new FormData();
      formData.append('company_name', data.companyName);
      formData.append('location', 'Bangladesh'); // Default or extracted from address
      formData.append('full_address', data.address);
      formData.append('company_mail', data.email);
      formData.append('phone', data.phone);

      if (data.profileImage?.[0]) formData.append('profileImage', data.profileImage[0]);
      if (data.nidScan?.[0]) formData.append('nidScan', data.nidScan[0]);
      if (data.tradeLicenseFile?.[0]) formData.append('tradeLicenseFile', data.tradeLicenseFile[0]);
      if (data.tinFile?.[0]) formData.append('tinFile', data.tinFile[0]);
      if (data.binFile?.[0]) formData.append('binFile', data.binFile[0]);

      await submitApplication(formData);
      navigate('/');
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Benefits (Takes 5 columns) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
                <Building2 size={16} /> Partner Program
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Scale your real estate business with us.
              </h1>
              <p className="text-gray-600">Complete the 2-step verification process to start listing your properties to thousands of verified buyers.</p>
            </div>

            <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={20} />
                <span className="font-medium text-gray-800">Reach thousands of active buyers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={20} />
                <span className="font-medium text-gray-800">Automated installment tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={20} />
                <span className="font-medium text-gray-800">Guaranteed payment settlements</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-step Form (Takes 7 columns) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
            
            {/* Progress Bar */}
            <div className="mb-8 flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300" style={{ width: step === 1 ? '0%' : '100%' }}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">{step === 1 ? 'Personal Information' : 'Business Details'}</h3>
              <p className="text-sm text-gray-500 mt-1">Step {step} of 2</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1 FIELDS */}
              <div className={step === 1 ? 'space-y-6' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name (As per NID)</label>
                    <input type="text" {...register("fullName", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" {...register("phone", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" placeholder="+880 1..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" {...register("email", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" placeholder="example@mail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">NID Number</label>
                    <input type="text" {...register("nidNumber", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" placeholder="1234567890" />
                  </div>
                </div>

                {/* File Uploads Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image</label>
                    <input type="file" accept=".jpg,.jpeg,.png" {...register("profileImage", { validate: validateFile })} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-2 bg-gray-50" />
                    {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">NID Scan Copy</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register("nidScan", { validate: validateFile })} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-2 bg-gray-50" />
                    {errors.nidScan && <p className="text-red-500 text-xs mt-1">{errors.nidScan.message as string}</p>}
                  </div>
                </div>
                
                <p className="text-xs text-gray-400">Allowed formats: PDF, JPG, PNG. Maximum size: 5MB per file.</p>
                
                <button type="button" onClick={handleNextStep} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2">
                  Next Step <ArrowRight size={18} />
                </button>
              </div>

              {/* STEP 2 FIELDS */}
              <div className={step === 2 ? 'space-y-6' : 'hidden'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company / Agency Name</label>
                  <input type="text" {...register("companyName", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" placeholder="BuildWell Properties" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade License No.</label>
                    <input type="text" {...register("tradeLicense", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">TIN Number</label>
                    <input type="text" {...register("tinNumber", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">BIN Number</label>
                    <input type="text" {...register("binNumber", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Address</label>
                  <textarea rows={2} {...register("address", { required: true })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50 custom-scrollbar"></textarea>
                </div>

                {/* File Uploads Step 2 */}
                <div className="space-y-4 border border-gray-200 p-4 rounded-xl bg-gray-50">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2"><UploadCloud size={16}/> Business Documents</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Trade License Copy</label>
                      <input type="file" accept=".pdf,.jpg,.png" {...register("tradeLicenseFile", { validate: validateFile })} className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-200 hover:file:bg-gray-300" />
                      {errors.tradeLicenseFile && <p className="text-red-500 text-xs mt-1">{errors.tradeLicenseFile.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">TIN Certificate</label>
                      <input type="file" accept=".pdf,.jpg,.png" {...register("tinFile", { validate: validateFile })} className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-200 hover:file:bg-gray-300" />
                      {errors.tinFile && <p className="text-red-500 text-xs mt-1">{errors.tinFile.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">BIN Certificate</label>
                      <input type="file" accept=".pdf,.jpg,.png" {...register("binFile", { validate: validateFile })} className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-200 hover:file:bg-gray-300" />
                      {errors.binFile && <p className="text-red-500 text-xs mt-1">{errors.binFile.message as string}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
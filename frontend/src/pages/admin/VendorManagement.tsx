import { useState } from 'react';
import { Search, Eye, CheckCircle2, XCircle, FileText, Building2, User, Loader2 } from 'lucide-react';
import { useVendorApplications, useReviewApplication } from '../../hooks/api/useAdmin';
import type { IVendorApplication } from '../../types/shared.types';

export default function VendorManagement() {
  const { data: applications, isLoading, isError } = useVendorApplications();
  const { mutateAsync: reviewApplication, isPending } = useReviewApplication();
  
  const [selectedVendor, setSelectedVendor] = useState<IVendorApplication | null>(null);

  const handleApprove = async (id: string, user_id: string) => {
    await reviewApplication({ id, status: 'APPROVED', user_id });
    setSelectedVendor(null);
  };

  const handleReject = async (id: string, user_id: string) => {
    await reviewApplication({ id, status: 'REJECTED', user_id });
    setSelectedVendor(null);
  };

  const parseDocuments = (docString: string) => {
    try {
      return JSON.parse(docString);
    } catch {
      return {};
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError || !applications) {
    return (
      <div className="text-center text-red-500 p-4">
        Failed to load vendor applications.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-500">Review, approve, or reject vendor applications.</p>
        </div>
        
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vendors..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="py-4 px-6 font-medium">Company Details</th>
                <th className="py-4 px-6 font-medium">Contact Person</th>
                <th className="py-4 px-6 font-medium">Applied On</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No vendor applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{app.company_name}</div>
                      <div className="text-xs text-gray-500">Req ID: {app.id.substring(0,8)}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="font-medium text-gray-800">{app.applicant_name}</div>
                      <div className="text-xs text-gray-500">{app.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{new Date(app.created_at || '').toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {app.status === 'PENDING' && <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">Pending</span>}
                      {app.status === 'APPROVED' && <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">Approved</span>}
                      {app.status === 'REJECTED' && <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">Rejected</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedVendor(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                      >
                        <Eye size={16} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedVendor(null)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-full flex flex-col transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Review Application</h3>
                <p className="text-sm text-gray-500">Req ID: {selectedVendor.id}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><User size={18}/> Applicant Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 w-24 inline-block">Name:</span> <span className="font-medium">{selectedVendor.applicant_name}</span></p>
                    <p><span className="text-gray-500 w-24 inline-block">Phone:</span> <span className="font-medium">{selectedVendor.phone}</span></p>
                    <p><span className="text-gray-500 w-24 inline-block">Email:</span> <span className="font-medium">{selectedVendor.applicant_email}</span></p>
                  </div>
                </div>

                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><Building2 size={18}/> Business Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 w-28 inline-block">Company:</span> <span className="font-bold text-blue-600">{selectedVendor.company_name}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">Location:</span> <span className="font-medium">{selectedVendor.location}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">Address:</span> <span className="font-medium">{selectedVendor.full_address}</span></p>
                  </div>
                </div>
              </div>

              
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2 mb-4"><FileText size={18}/> Submitted Documents</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(parseDocuments(selectedVendor.document_url)).map(([key, url]) => (
                    <a href={url as string} target="_blank" rel="noopener noreferrer" key={key} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      <FileText className="text-blue-500" size={32} />
                      <span className="text-xs font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-[10px] text-gray-400">View Document</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            
            {selectedVendor.status === 'PENDING' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex gap-4">
                <button 
                  onClick={() => handleReject(selectedVendor.id, selectedVendor.user_id)}
                  disabled={isPending}
                  className="flex-1 py-3 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(selectedVendor.id, selectedVendor.user_id)}
                  disabled={isPending}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 size={18} /> Approve Vendor
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
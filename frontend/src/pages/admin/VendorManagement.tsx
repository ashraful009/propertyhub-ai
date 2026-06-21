import { useState } from 'react';
import { Search, Eye, CheckCircle2, XCircle, FileText, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';

// ডামি ইন্টারফেস ও ডাটা
interface VendorApp {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  documents: {
    nid: string;
    tradeLicense: string;
    tin: string;
    bin: string;
  };
}

const mockApplications: VendorApp[] = [
  {
    id: "REQ-001",
    companyName: "Prime Space Properties",
    contactPerson: "Ahmed Hasan",
    email: "ahmed@primespace.com",
    phone: "+880 1711 000000",
    status: "pending",
    appliedDate: "21 Jun, 2026",
    documents: { nid: "NID_1234567890", tradeLicense: "TRAD/DSCC/123/2026", tin: "TIN-987654321", bin: "BIN-11223344" }
  },
  {
    id: "REQ-002",
    companyName: "BuildWell Properties",
    contactPerson: "John Doe",
    email: "john@buildwell.com",
    phone: "+880 1811 000000",
    status: "approved",
    appliedDate: "18 Jun, 2026",
    documents: { nid: "NID_0987654321", tradeLicense: "TRAD/DNCC/456/2026", tin: "TIN-123456789", bin: "BIN-55667788" }
  }
];

export default function VendorManagement() {
  const [applications, setApplications] = useState<VendorApp[]>(mockApplications);
  const [selectedVendor, setSelectedVendor] = useState<VendorApp | null>(null);

  const handleApprove = (id: string) => {
    setApplications(apps => apps.map(app => app.id === id ? { ...app, status: 'approved' } : app));
    setSelectedVendor(null);
    toast.success('Vendor Approved Successfully!');
  };

  const handleReject = (id: string) => {
    setApplications(apps => apps.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
    setSelectedVendor(null);
    toast.error('Vendor Application Rejected.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-500">Review, approve, or reject vendor applications.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vendors..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Applications Table */}
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
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{app.companyName}</div>
                    <div className="text-xs text-gray-500">Req ID: {app.id}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="font-medium text-gray-800">{app.contactPerson}</div>
                    <div className="text-xs text-gray-500">{app.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{app.appliedDate}</td>
                  <td className="py-4 px-6">
                    {app.status === 'pending' && <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">Pending</span>}
                    {app.status === 'approved' && <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">Approved</span>}
                    {app.status === 'rejected' && <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">Rejected</span>}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
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
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><User size={18}/> Applicant Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 w-24 inline-block">Name:</span> <span className="font-medium">{selectedVendor.contactPerson}</span></p>
                    <p><span className="text-gray-500 w-24 inline-block">Phone:</span> <span className="font-medium">{selectedVendor.phone}</span></p>
                    <p><span className="text-gray-500 w-24 inline-block">Email:</span> <span className="font-medium">{selectedVendor.email}</span></p>
                    <p><span className="text-gray-500 w-24 inline-block">NID No:</span> <span className="font-medium">{selectedVendor.documents.nid}</span></p>
                  </div>
                </div>

                {/* Business Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><Building2 size={18}/> Business Info</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 w-28 inline-block">Company:</span> <span className="font-bold text-blue-600">{selectedVendor.companyName}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">Trade License:</span> <span className="font-medium">{selectedVendor.documents.tradeLicense}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">TIN No:</span> <span className="font-medium">{selectedVendor.documents.tin}</span></p>
                    <p><span className="text-gray-500 w-28 inline-block">BIN No:</span> <span className="font-medium">{selectedVendor.documents.bin}</span></p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Preview (Simulated) */}
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2 mb-4"><FileText size={18}/> Submitted Documents</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['NID Card', 'Trade License', 'TIN Certificate', 'BIN Certificate'].map((doc, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      <FileText className="text-blue-500" size={32} />
                      <span className="text-xs font-semibold text-gray-700">{doc}</span>
                      <span className="text-[10px] text-gray-400">View PDF/IMG</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedVendor.status === 'pending' && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex gap-4">
                <button 
                  onClick={() => handleReject(selectedVendor.id)}
                  className="flex-1 py-3 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(selectedVendor.id)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 flex justify-center items-center gap-2 transition-colors"
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
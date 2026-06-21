import { useState } from 'react';
import { FileEdit, Plus, Trash2, Save, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

// পলিসির টাইপ ডিফাইন
interface PolicyRule {
  id: string;
  title: string;
  description: string;
  isMandatory?: boolean;
}

export default function PolicyManager() {
  const [activeTab, setActiveTab] = useState<'vendor' | 'customer'>('vendor');
  const [isSaving, setIsSaving] = useState(false);

  // ডামি ভেন্ডর পলিসি (ভবিষ্যতে ডাটাবেস থেকে আসবে)
  const [vendorPolicies, setVendorPolicies] = useState<PolicyRule[]>([
    {
      id: 'vp-1',
      title: 'Platform Commission (Mandatory)',
      description: 'PropertyHub will automatically deduct a strict 5% commission from every installment or booking payment made by the customer.',
      isMandatory: true
    },
    {
      id: 'vp-2',
      title: 'Document Authenticity',
      description: 'All submitted documents (TIN, BIN, Trade License) must be 100% authentic. Forged documents will result in permanent suspension.',
    }
  ]);

  // ডামি কাস্টমার পলিসি
  const [customerPolicies, setCustomerPolicies] = useState<PolicyRule[]>([
    {
      id: 'cp-1',
      title: 'Cancellation & Refunds',
      description: 'You can cancel your booking and request a refund within exactly 1 month (30 days) of the booking date.',
    },
    {
      id: 'cp-2',
      title: 'Refund Deductions',
      description: 'In the event of an approved cancellation, a 10% service and processing charge will be deducted from the total paid amount.',
    }
  ]);

  // পলিসি অ্যাড, আপডেট এবং ডিলিট করার ফাংশন
  const handleAddPolicy = () => {
    const newPolicy = { id: `new-${Date.now()}`, title: '', description: '' };
    if (activeTab === 'vendor') {
      setVendorPolicies([...vendorPolicies, newPolicy]);
    } else {
      setCustomerPolicies([...customerPolicies, newPolicy]);
    }
  };

  const handleUpdatePolicy = (id: string, field: 'title' | 'description', value: string) => {
    if (activeTab === 'vendor') {
      setVendorPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    } else {
      setCustomerPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };

  const handleDeletePolicy = (id: string) => {
    if (activeTab === 'vendor') {
      setVendorPolicies(prev => prev.filter(p => p.id !== id));
    } else {
      setCustomerPolicies(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // API কল সিমুলেশন
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${activeTab === 'vendor' ? 'Vendor' : 'Customer'} Policies saved successfully!`);
    }, 1500);
  };

  const currentPolicies = activeTab === 'vendor' ? vendorPolicies : customerPolicies;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Manager</h1>
        <p className="text-gray-500">Dynamically update terms, conditions, and rules for users.</p>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('vendor')}
          className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'vendor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Vendor Policies
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'customer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Customer / Booking Policies
        </button>
      </div>

      {/* Editor Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FileEdit className="text-blue-500" size={24} />
            <h3 className="text-lg font-bold text-gray-900">
              {activeTab === 'vendor' ? 'Vendor Terms & Conditions' : 'Customer Booking Policy'}
            </h3>
          </div>
          <button 
            onClick={handleAddPolicy}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {currentPolicies.map((policy, index) => (
            <div key={policy.id} className="relative bg-gray-50 p-5 rounded-2xl border border-gray-100 group">
              
              {policy.isMandatory && (
                <div className="absolute -top-3 left-4 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider">
                  <ShieldAlert size={12} /> System Mandatory
                </div>
              )}

              <button 
                onClick={() => !policy.isMandatory && handleDeletePolicy(policy.id)}
                disabled={policy.isMandatory}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  policy.isMandatory 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
                title={policy.isMandatory ? "Cannot delete core system policy" : "Delete policy"}
              >
                <Trash2 size={18} />
              </button>

              <div className="space-y-4 pr-10 mt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Rule Title {index + 1}</label>
                  <input
                    type="text"
                    value={policy.title}
                    onChange={(e) => handleUpdatePolicy(policy.id, 'title', e.target.value)}
                    placeholder="e.g. Refund Deductions"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Rule Description</label>
                  <textarea
                    rows={3}
                    value={policy.description}
                    onChange={(e) => handleUpdatePolicy(policy.id, 'description', e.target.value)}
                    placeholder="Write the detailed policy here..."
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none custom-scrollbar"
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          {currentPolicies.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No policies added yet. Click "Add Rule" to get started.</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 disabled:bg-slate-400"
          >
            {isSaving ? 'Saving Updates...' : (
              <><Save size={18} /> Save Policy Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { FileEdit, Plus, Trash2, Save, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePolicies, useCreatePolicy, useUpdatePolicy, useDeletePolicy } from '../../hooks/api/useAdmin';

interface PolicyRule {
  id: string;
  title: string;
  description: string;
  isMandatory?: boolean;
}

export default function PolicyManager() {
  const [activeTab, setActiveTab] = useState<'vendor' | 'customer'>('vendor');
  const [isSaving, setIsSaving] = useState(false);
  const [currentPolicies, setCurrentPolicies] = useState<PolicyRule[]>([]);

  const policyType = activeTab === 'vendor' ? 'VENDOR' : 'CUSTOMER';
  const { data: dbPolicies, isLoading } = usePolicies(policyType);
  const { mutateAsync: createPolicy } = useCreatePolicy();
  const { mutateAsync: updatePolicy } = useUpdatePolicy();
  const { mutateAsync: deletePolicy } = useDeletePolicy();

  useEffect(() => {
    if (dbPolicies) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPolicies(dbPolicies.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.content,
        isMandatory: p.is_mandatory
      })));
    }
  }, [dbPolicies, activeTab]);

  const handleAddPolicy = () => {
    const newPolicy = { id: `new-${Date.now()}`, title: '', description: '' };
    setCurrentPolicies([...currentPolicies, newPolicy]);
  };

  const handleUpdatePolicy = (id: string, field: 'title' | 'description', value: string) => {
    setCurrentPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePolicy = (id: string) => {
    setCurrentPolicies(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const policy of currentPolicies) {
        if (policy.id.startsWith('new-')) {
          if (policy.title && policy.description) {
            await createPolicy({
              policy_type: policyType,
              title: policy.title,
              content: policy.description
            });
          }
        } else {
          // Find if changed
          const original = dbPolicies?.find(p => String(p.id) === policy.id);
          if (original && (original.title !== policy.title || original.content !== policy.description)) {
            await updatePolicy({ id: policy.id, payload: { title: policy.title, content: policy.description } });
          }
        }
      }

      const deleted = dbPolicies?.filter(dbp => !currentPolicies.find(cp => cp.id === String(dbp.id))) || [];
      for (const d of deleted) {
        if (!d.is_mandatory) {
          await deletePolicy(String(d.id));
        }
      }

      toast.success(`${activeTab === 'vendor' ? 'Vendor' : 'Customer'} Policies saved successfully!`);
    } catch (error) {
      console.error('Failed to save policies', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Manager</h1>
        <p className="text-gray-500">Dynamically update terms, conditions, and rules for users.</p>
      </div>

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
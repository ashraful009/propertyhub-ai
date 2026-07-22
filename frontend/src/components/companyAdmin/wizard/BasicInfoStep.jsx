import React from 'react';
import LocationPicker from '../LocationPicker';

const CATEGORIES = ['Apartments', 'Villas', 'Land'];
const CATEGORY_ICONS = { Apartments: '🏢', Villas: '🏡', Land: '🌿' };

const FormField = ({ label, required, children, span2 }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="form-label">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

const BasicInfoStep = ({ form, setForm, location, setLocation, handleChange, handleAddressBlur }) => (
  <section className="glass-card p-6">
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
      <span className="text-2xl">📋</span>
      <div>
        <h3 className="text-gray-900 font-semibold text-base">Basic Information</h3>
        <p className="text-gray-500 text-xs mt-0.5">Core property details</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="form-label">Category <span className="text-red-600">*</span></label>
        <div className="grid grid-cols-3 gap-2 max-w-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat} type="button"
              onClick={() => setForm((p) => ({ ...p, category: cat }))}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                form.category === cat
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-600'
                  : 'border-blue-100 text-gray-500 hover:border-blue-200 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <FormField label="Property Title" required>
          <input name="title" type="text" required value={form.title} onChange={handleChange} className="form-input" placeholder="e.g. Skyline Residences Block A" />
        </FormField>
      </div>
      <FormField label="City" required>
        <input name="city" type="text" required value={form.city} onChange={handleChange} className="form-input" placeholder="Dhaka" />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Full Address" required>
          <input name="address" type="text" required value={form.address} onChange={handleChange} onBlur={handleAddressBlur} className="form-input" placeholder="Road 10, Block C, Gulshan, Dhaka" />
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <label className="form-label flex justify-between items-end">
          <span>Location on Map <span className="text-gray-500 font-normal text-sm">(auto-updated from address)</span></span>
        </label>
        <LocationPicker value={location} onChange={setLocation} />
      </div>
      <div className="sm:col-span-2">
        <FormField label="Property Description" required>
          <textarea name="description" required rows={3} value={form.description} onChange={handleChange} className="form-input resize-none" placeholder="Describe the property..." />
        </FormField>
      </div>
    </div>
  </section>
);

export default BasicInfoStep;

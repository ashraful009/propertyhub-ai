import React from 'react';

const FormField = ({ label, required, children, span2 }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="form-label">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

const YesNoSelect = ({ name, value, onChange }) => (
  <select name={name} value={value} onChange={onChange} className="form-input">
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
);

const VillaSpecStep = ({ villaForm, handleVilla }) => (
  <>
    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        <span className="text-2xl">📍</span>
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Villa Location Details</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Area" required>
          <input name="area" type="text" value={villaForm.area} onChange={handleVilla} className="form-input" placeholder="Gulshan, Dhaka" />
        </FormField>
        <FormField label="Road Access">
          <input name="roadAccess" type="text" value={villaForm.roadAccess} onChange={handleVilla} className="form-input" placeholder="100 meters" />
        </FormField>
      </div>
    </section>

    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        <span className="text-2xl">🏗️</span>
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Villa Specifications</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField label="Total Land Size (Katha)">
          <input name="totalLandSize" type="number" min="0" value={villaForm.totalLandSize} onChange={handleVilla} className="form-input" placeholder="5" />
        </FormField>
        <FormField label="Total Floors">
          <input name="totalFloors" type="number" min="1" value={villaForm.totalFloors} onChange={handleVilla} className="form-input" placeholder="2" />
        </FormField>
        <FormField label="Bedrooms">
          <input name="bedrooms" type="number" min="0" value={villaForm.bedrooms} onChange={handleVilla} className="form-input" placeholder="4" />
        </FormField>
        <FormField label="Bathrooms">
          <input name="bathrooms" type="number" min="0" value={villaForm.bathrooms} onChange={handleVilla} className="form-input" placeholder="3" />
        </FormField>
        <FormField label="Living Room">
          <YesNoSelect name="living" value={villaForm.living} onChange={handleVilla} />
        </FormField>
        <FormField label="Dining Room">
          <YesNoSelect name="dining" value={villaForm.dining} onChange={handleVilla} />
        </FormField>
        <FormField label="Kitchen">
          <YesNoSelect name="kitchen" value={villaForm.kitchen} onChange={handleVilla} />
        </FormField>
      </div>
    </section>
  </>
);

export default VillaSpecStep;

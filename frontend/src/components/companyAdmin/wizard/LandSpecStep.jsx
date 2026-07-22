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

const LandSpecStep = ({ landForm, handleLand }) => (
  <>
    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        <span className="text-2xl">📍</span>
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Land Location Details</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Area" required>
          <input name="area" type="text" value={landForm.area} onChange={handleLand} className="form-input" placeholder="Keraniganj, Dhaka" />
        </FormField>
        <FormField label="Road Access">
          <YesNoSelect name="roadAccess" value={landForm.roadAccess} onChange={handleLand} />
        </FormField>
      </div>
    </section>

    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        <span className="text-2xl">📏</span>
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Land Measurements & Legal</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Total Size (Katha)">
          <input name="totalSize" type="number" min="0" value={landForm.totalSize} onChange={handleLand} className="form-input" placeholder="10" />
        </FormField>
        <FormField label="Plot Shape">
          <select name="plotShape" value={landForm.plotShape} onChange={handleLand} className="form-input">
            <option value="Square">Square</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Irregular">Irregular</option>
          </select>
        </FormField>
        <FormField label="Khatian Number">
          <input name="khatianNumber" type="text" value={landForm.khatianNumber} onChange={handleLand} className="form-input" placeholder="12345" />
        </FormField>
        <FormField label="Dag Number">
          <input name="dagNumber" type="text" value={landForm.dagNumber} onChange={handleLand} className="form-input" placeholder="678" />
        </FormField>
      </div>
    </section>
  </>
);

export default LandSpecStep;

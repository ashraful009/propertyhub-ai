import React from 'react';
import { TYPE_COLORS } from '../../../hooks/useAddProperty';

const FormField = ({ label, required, children, span2 }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="form-label">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

const ApartmentSpecStep = ({
  form,
  handleChange,
  flatTypes,
  addFlatType,
  removeFlatType,
  updateFlatType,
  floors,
  unitsPerFlr,
  getUnitLabel,
  getTypeIndexForCol,
  selectedUnit,
  setSelectedUnit,
}) => (
  <>
    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Property Overview</h3>
          <p className="text-gray-500 text-xs mt-0.5">Building specifications</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField label="Total Units">
          <input name="totalUnitsCount" type="number" min="0" value={form.totalUnitsCount} onChange={handleChange} className="form-input" placeholder="e.g. 40" />
        </FormField>
        <FormField label="Total Floors" required>
          <input name="totalFloors" type="number" required min="1" max="100" value={form.totalFloors} onChange={handleChange} className="form-input" />
        </FormField>
        <FormField label="Units per Floor" required>
          <input name="unitsPerFloor" type="number" required min="1" max="20" value={form.unitsPerFloor} onChange={handleChange} className="form-input" />
        </FormField>
        <FormField label="Land Size">
          <input name="landSize" type="text" value={form.landSize} onChange={handleChange} className="form-input" placeholder="e.g. 5 Katha" />
        </FormField>
        <FormField label="Handover Time">
          <input name="handoverTime" type="text" value={form.handoverTime} onChange={handleChange} className="form-input" placeholder="e.g. Q4 2026" />
        </FormField>
      </div>
    </section>

    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Unit Types</h3>
          <p className="text-gray-500 text-xs mt-0.5">Define different flat configurations</p>
        </div>
      </div>
      <div className="space-y-6">
        {flatTypes.map((ft, idx) => (
          <div key={idx} className="bg-slate-50 border border-blue-100 rounded-xl p-5 relative">
            {flatTypes.length > 1 && (
              <button type="button" onClick={() => removeFlatType(idx)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30 text-sm">
                
              </button>
            )}
            <p className="text-primary-600 text-xs font-semibold mb-4 uppercase tracking-wider">Type {idx + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <FormField label="Type Label">
                  <input type="text" value={ft.label} placeholder="e.g. Type A 1200 sft" onChange={(e) => updateFlatType(idx, 'label', e.target.value)} className="form-input" />
                </FormField>
              </div>
              <FormField label="Square Feet">
                <input type="number" min="0" value={ft.sqft} placeholder="1200" onChange={(e) => updateFlatType(idx, 'sqft', e.target.value)} className="form-input" />
              </FormField>
              <FormField label="Price per Unit (BDT)">
                <input type="number" min="0" value={ft.pricePerUnit} placeholder="4500000" onChange={(e) => updateFlatType(idx, 'pricePerUnit', e.target.value)} className="form-input" />
              </FormField>
              <FormField label="Bedrooms">
                <input type="number" min="0" max="10" value={ft.bedrooms} onChange={(e) => updateFlatType(idx, 'bedrooms', e.target.value === '' ? '' : Number(e.target.value))} className="form-input" />
              </FormField>
              <FormField label="Washrooms">
                <input type="number" min="0" max="10" value={ft.bathrooms} onChange={(e) => updateFlatType(idx, 'bathrooms', e.target.value === '' ? '' : Number(e.target.value))} className="form-input" />
              </FormField>
            </div>
          </div>
        ))}
        {flatTypes.length < unitsPerFlr && (
          <button type="button" onClick={addFlatType} className="w-full py-3 rounded-xl border-2 border-dashed border-primary-500/30 text-primary-600 hover:border-primary-500/60 text-sm font-medium flex items-center justify-center gap-2">
            + Add Another Type ({flatTypes.length}/{unitsPerFlr})
          </button>
        )}
      </div>
    </section>

    <section className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
        
        <div>
          <h3 className="text-gray-900 font-semibold text-base">Interactive Visualizer</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-72 overflow-y-auto">
        <div className="flex flex-col-reverse gap-1.5">
          {Array.from({ length: Math.min(floors, 20) }).map((_, fi) => (
            <div key={fi} className="flex items-center gap-2">
              <span className="text-gray-600 text-xs w-7 text-right flex-shrink-0 font-mono">F{fi + 1}</span>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: unitsPerFlr }).map((_, ui) => {
                  const typeIdx = getTypeIndexForCol(ui);
                  const colors = TYPE_COLORS[typeIdx % TYPE_COLORS.length];
                  const unitLabel = getUnitLabel(fi + 1, ui);
                  const isSelected = selectedUnit?.floor === fi + 1 && selectedUnit?.col === ui;
                  return (
                    <button type="button" key={ui} onClick={() => setSelectedUnit({ floor: fi + 1, col: ui, typeIndex: typeIdx })} className={`w-12 h-9 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} text-[10px] font-mono ${isSelected ? 'ring-2 ring-blue-200 scale-110' : ''}`}>
                      {unitLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default ApartmentSpecStep;

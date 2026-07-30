import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'text-emerald-600', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  booked:    { label: 'Booked',    color: 'text-amber-600',   bg: 'bg-amber-500/15 border-amber-500/30'   },
  sold:      { label: 'Sold Out',  color: 'text-red-600',     bg: 'bg-red-500/15 border-red-500/30'       },
};

const getFlatTypeForUnit = (unit, property) => {
  const flatTypes = property?.flatTypes;
  if (!flatTypes?.length || property?.category !== 'apartment') return null;

  const match = unit.unitNumber?.match(/\d+([A-Z]+)/i);
  if (!match) return null;
  const colIndex = match[1].charCodeAt(0) - 65; 
  const typeIndex = Math.min(colIndex, flatTypes.length - 1);
  return flatTypes[typeIndex] || null;
};

const UnitDetailView = ({ unit, property }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!unit) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50 border border-blue-100 rounded-3xl p-8 text-center">
      <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
      <p className="font-semibold text-gray-500">Select a unit to view details</p>
      <p className="text-sm mt-1">Click on an available unit in the visualizer to see pricing and booking options.</p>
    </div>
  );

  const cfg = STATUS_CONFIG[unit.status];
  const flatType = getFlatTypeForUnit(unit, property);
  const displayPrice = flatType?.pricePerUnit || unit.price || property?.price;

  const handleBooking = () => {
    navigate(`/checkout/${unit._id}`);
  };

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {property?.category === 'apartment' ? (
            <>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                Floor {unit.floor}
              </p>
              <h3 className="text-2xl font-blackops text-gray-900 tracking-wider">
                Unit {unit.unitNumber}
              </h3>
            </>
          ) : (
            <h3 className="text-2xl font-blackops text-gray-900 capitalize tracking-wider">
              {property?.category} Booking
            </h3>
          )}
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Flat Type / General Details */}
        {flatType ? (
          <div className="space-y-5 mb-6">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <span className="text-primary-600 font-semibold text-sm">
                {flatType.label || 'Unnamed Type'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Square Feet', value: flatType.sqft ? `${flatType.sqft} sft` : '—' },
                { label: 'Bedrooms',    value: flatType.bedrooms ?? '—' },
                { label: 'Washrooms',   value: flatType.bathrooms ?? '—' },
                { label: 'Kitchen',     value: flatType.kitchen || '—' },
                { label: 'Dining',      value: flatType.dining || '—' },
                { label: 'Drawing',     value: flatType.drawing || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 border border-blue-100 rounded-xl px-4 py-3">
                  <p className="text-gray-500 text-xs mb-1">{label}</p>
                  <p className="text-gray-900 font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>

            {flatType.description && (
              <div className="bg-slate-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">Type Description</p>
                <p className="text-gray-600 text-sm leading-relaxed">{flatType.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Type',   value: unit.type   || '—' },
              { label: 'Size',   value: unit.size || property?.landSize || (property?.landDetails?.totalSize ? `${property.landDetails.totalSize} Katha` : null) || (property?.villaDetails?.totalLandSize ? `${property.villaDetails.totalLandSize} Katha` : null) || '—' },
              { label: 'Facing', value: unit.facing || '—', hide: !unit.facing },
            ]
              .filter((item) => !item.hide)
              .map(({ label, value }) => (
              <div key={label} className="bg-slate-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-gray-900 font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {unit.features?.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {unit.features.map((f) => (
                <span key={f} className="text-xs px-3 py-1.5 bg-slate-50 border border-blue-100 text-gray-600 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Booking (Always at the bottom) */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm">Unit Price</span>
          <span className="text-2xl font-blackops text-primary-600 tracking-wider">
            {displayPrice ? `৳${displayPrice.toLocaleString()}` : 'Contact for Price'}
          </span>
        </div>

        {unit.status === 'available' ? (
          isAuthenticated ? (
            <div className="space-y-3">
              <textarea
                className="form-input resize-none w-full text-sm"
                rows="2"
                placeholder="Message to the vendor (optional)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleBooking}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center py-3 text-lg"
              >
                {loading ? 'Confirming...' : 'Request Booking'}
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center block py-3 text-lg">
              Login to Book this Unit
            </Link>
          )
        ) : (
          <div className={`w-full py-4 rounded-xl text-center text-sm font-semibold border ${cfg.bg} ${cfg.color}`}>
            {unit.status === 'booked' ? 'This unit is already booked' : 'This unit has been sold'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitDetailView;

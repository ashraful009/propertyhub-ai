import { useState } from 'react';

const STATUS_CONFIG = {
  available: {
    bg:    'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
    text:  'text-emerald-600',
    dot:   'bg-emerald-400',
    label: 'Available',
  },
  booked: {
    bg:    'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30 hover:border-amber-400',
    text:  'text-amber-600',
    dot:   'bg-amber-400',
    label: 'Booked',
  },
  sold: {
    bg:    'bg-red-500/20 border-red-500/40 cursor-not-allowed',
    text:  'text-red-600',
    dot:   'bg-red-400',
    label: 'Sold',
  },
};

const FILTERS = ['all', 'available', 'booked', 'sold'];

const TYPE_COLORS = [
  { bg: 'bg-blue-400/20',   border: 'border-blue-400/40',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  { bg: 'bg-pink-400/20',   border: 'border-pink-400/40',   text: 'text-pink-300',   dot: 'bg-pink-400' },
  { bg: 'bg-amber-400/20',  border: 'border-amber-400/40',  text: 'text-amber-300',  dot: 'bg-amber-400' },
  { bg: 'bg-teal-400/20',   border: 'border-teal-400/40',   text: 'text-teal-300',   dot: 'bg-teal-400' },
  { bg: 'bg-purple-400/20', border: 'border-purple-400/40', text: 'text-purple-300', dot: 'bg-purple-400' },
  { bg: 'bg-rose-400/20',   border: 'border-rose-400/40',   text: 'text-rose-300',   dot: 'bg-rose-400' },
  { bg: 'bg-cyan-400/20',   border: 'border-cyan-400/40',   text: 'text-cyan-300',   dot: 'bg-cyan-400' },
  { bg: 'bg-lime-400/20',   border: 'border-lime-400/40',   text: 'text-lime-300',   dot: 'bg-lime-400' },
  { bg: 'bg-orange-400/20', border: 'border-orange-400/40', text: 'text-orange-300', dot: 'bg-orange-400' },
  { bg: 'bg-indigo-400/20', border: 'border-indigo-400/40', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  { bg: 'bg-emerald-400/20',border: 'border-emerald-400/40',text: 'text-emerald-300',dot: 'bg-emerald-400' },
  { bg: 'bg-fuchsia-400/20',border: 'border-fuchsia-400/40',text: 'text-fuchsia-300',dot: 'bg-fuchsia-400' },
];

const getTypeIndexForUnit = (unit, flatTypes) => {
  if (!flatTypes?.length) return -1;
  const match = unit.unitNumber?.match(/\d+([A-Z]+)/i);
  if (!match) return 0;
  const colIndex = match[1].charCodeAt(0) - 65;
  return Math.min(colIndex, flatTypes.length - 1);
};

const ApartmentVisualizer = ({ units, grouped, stats, property, onUnitClick }) => {
  const [filter, setFilter] = useState('all');
  const flatTypes = property?.flatTypes || [];
  const hasFlatTypes = flatTypes.length > 0;

  const filteredGrouped = filter === 'all'
    ? grouped
    : Object.fromEntries(
        Object.entries(grouped).map(([floor, floorUnits]) => [
          floor,
          floorUnits.filter((u) => u.status === filter),
        ]).filter(([, u]) => u.length > 0)
      );

  const filteredFloors = Object.keys(filteredGrouped)
    .map(Number)
    .sort((a, b) => b - a);

  if (units.length === 0) {
    return (
      <div className="glass-card py-12 text-center">
        <p className="text-gray-500 text-sm">No units available for this property yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {[
          { label: 'Total Units',  value: stats.total,     color: 'text-gray-900'         },
          { label: 'Available',    value: stats.available, color: 'text-emerald-600'   },
          { label: 'Booked',       value: stats.booked,    color: 'text-amber-600'     },
          { label: 'Sold',         value: stats.sold,      color: 'text-red-600'       },
        ].map(({ label, value, color }) => (
          <div key={label}
            className="bg-slate-50 border border-blue-100 rounded-xl px-2 py-2 sm:px-4 sm:py-3 text-center">
            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value ?? 0}</p>
            <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {hasFlatTypes && (
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 p-2 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] sm:text-xs text-gray-500 self-center">Unit Types:</span>
          {flatTypes.map((ft, idx) => (
            <div key={idx} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${TYPE_COLORS[idx % TYPE_COLORS.length].dot}`} />
              <span className="text-gray-900 font-medium">{ft.label || `Type ${String.fromCharCode(65 + idx)}`}</span>
              {ft.sqft && <span className="text-gray-600 hidden sm:inline">({ft.sqft} sft)</span>}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium
                        border transition-all duration-200
                        ${filter === f
                          ? 'bg-primary-500/20 border-primary-500/50 text-primary-600'
                          : 'bg-slate-50 border-blue-100 text-gray-500 hover:text-gray-900 hover:border-blue-200'
                        }`}
          >
            {f !== 'all' && (
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${STATUS_CONFIG[f]?.dot}`} />
            )}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="text-gray-500">({stats[f] ?? 0})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 border border-blue-100 rounded-2xl p-3 sm:p-6 overflow-x-auto w-full">
        {filteredFloors.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-xs sm:text-sm">
            No {filter} units found.
          </p>
        ) : (
          <div className="space-y-2 min-w-max mx-auto">
            {filteredFloors.map((floorNum) => {
              const floorUnits = filteredGrouped[floorNum] || [];
              return (
                <div key={floorNum} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-12 flex-shrink-0 text-right">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      F{floorNum}
                    </span>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {floorUnits.map((unit) => {
                      const statusCfg = STATUS_CONFIG[unit.status];
                      const isSold = unit.status === 'sold';
                      const typeIdx = hasFlatTypes ? getTypeIndexForUnit(unit, flatTypes) : -1;
                      const typeColor = typeIdx >= 0 ? TYPE_COLORS[typeIdx % TYPE_COLORS.length] : null;
                      const ft = typeIdx >= 0 ? flatTypes[typeIdx] : null;
                      const typeLabel = ft?.label?.trim() || (typeIdx >= 0 ? String.fromCharCode(65 + typeIdx) : '');

                      return (
                        <button
                          key={unit._id}
                          onClick={() => !isSold && onUnitClick?.(unit)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex flex-col items-center
                                      justify-center gap-0.5 transition-all duration-200
                                      ${statusCfg.bg} ${isSold ? '' : 'cursor-pointer'}
                                      ${hasFlatTypes && typeColor ? `border-l-4 ${typeColor.border.replace('border-', 'border-l-')}` : ''}`}
                          title={`Unit ${unit.unitNumber} — ${statusCfg.label}${ft ? ` (${ft.label || 'Type ' + String.fromCharCode(65 + typeIdx)})` : ''}`}
                        >
                          <span className={`text-[10px] sm:text-xs font-bold leading-tight ${statusCfg.text}`}>
                            {unit.unitNumber}
                          </span>
                          {typeLabel && (
                            <span className="text-gray-500 leading-tight truncate w-full text-center px-0.5"
                                  style={{ fontSize: '8px' }}>
                              {typeLabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 justify-center">
        {Object.entries(STATUS_CONFIG).map(([key, { dot, label }]) => (
          <div key={key} className="flex items-center gap-1 sm:gap-1.5">
            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded ${dot}`} />
            <span className="text-gray-500 text-[10px] sm:text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentVisualizer;

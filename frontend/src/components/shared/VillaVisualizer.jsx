const VILLA_AMENITIES = [
  { key: 'privatePool',    label: 'Swimming Pool', icon: '🏊', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' },
  { key: 'garden',         label: 'Garden',        icon: '🌳', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  { key: 'garage',         label: 'Garage',        icon: '🚗', color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30' },
  { key: 'rooftopTerrace', label: 'Rooftop',       icon: '🌇', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
  { key: 'servantRoom',    label: 'Servant Room',  icon: '🛏️', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  { key: 'securitySystem', label: 'Security',      icon: '🔒', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },
];

const VillaVisualizer = ({ property }) => {
  const v = property?.villaDetails || {};
  const activeAmenities = VILLA_AMENITIES.filter((a) => v[a.key] === 'Yes');
  const floorCount = Number(v.totalFloors) || 2;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-blue-100 rounded-2xl p-4 sm:p-6 overflow-hidden">
        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-primary-400 rounded-full inline-block" />
          Villa Duplex Preview — <strong className="text-gray-900">{floorCount} Floor{floorCount > 1 ? 's' : ''}</strong>
        </p>

        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-[20rem]">
            <div className="flex justify-center mb-0">
              <div className="w-0 h-0 border-l-[120px] sm:border-l-[160px] border-r-[120px] sm:border-r-[160px] border-b-[50px] sm:border-b-[60px]
                              border-l-transparent border-r-transparent border-b-amber-700/40
                              relative">
                {v.rooftopTerrace === 'Yes' && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs bg-orange-500/20
                                  border border-orange-500/30 rounded px-1.5 sm:px-2 py-0.5 text-orange-400 whitespace-nowrap">
                    🌇 Rooftop
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              {Array.from({ length: Math.min(floorCount, 4) }).map((_, fi) => {
                const isTop = fi === 0;
                const isBottom = fi === Math.min(floorCount, 4) - 1;
                return (
                  <div key={fi}
                    className={`border-x-2 border-b-2 ${isTop ? 'border-t-2' : ''} border-blue-200
                                bg-white px-2 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2`}>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 w-full sm:w-8 text-center sm:text-left flex-shrink-0">
                      F{floorCount - fi}
                    </span>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center flex-1">
                      {Number(v.bedrooms) > 0 && fi === 0 && (
                        <span className="text-[10px] sm:text-xs bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 text-indigo-500">
                          🛏️ {v.bedrooms} Bed
                        </span>
                      )}
                      {Number(v.bathrooms) > 0 && fi === 0 && (
                        <span className="text-[10px] sm:text-xs bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5 text-blue-500">
                          🚿 {v.bathrooms} Bath
                        </span>
                      )}
                      {v.living === 'Yes' && fi === (floorCount > 1 ? 1 : 0) && (
                        <span className="text-[10px] sm:text-xs bg-teal-500/10 border border-teal-500/20 rounded px-1.5 py-0.5 text-teal-500">
                          🛋️ Living
                        </span>
                      )}
                      {v.kitchen === 'Yes' && isBottom && (
                        <span className="text-[10px] sm:text-xs bg-yellow-500/10 border border-yellow-500/30 rounded px-1.5 py-0.5 text-yellow-600">
                          🍳 Kitchen
                        </span>
                      )}
                      {v.dining === 'Yes' && isBottom && (
                        <span className="text-[10px] sm:text-xs bg-pink-500/10 border border-pink-500/20 rounded px-1.5 py-0.5 text-pink-500">
                          🍽️ Dining
                        </span>
                      )}
                      {v.servantRoom === 'Yes' && isBottom && (
                        <span className="text-[10px] sm:text-xs bg-purple-500/10 border border-purple-500/20 rounded px-1.5 py-0.5 text-purple-500">
                          🛏️ Servant
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 mt-3 justify-center flex-wrap">
              {v.garage === 'Yes' && (
                <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-slate-500">
                  🚗 Garage
                </div>
              )}
              {v.securitySystem === 'Yes' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-red-500">
                  🔒 Security
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2 justify-center flex-wrap">
              {v.garden === 'Yes' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs text-green-600">
                  🌳 Garden
                </div>
              )}
              {v.privatePool === 'Yes' && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs text-cyan-600">
                  🏊 Swimming Pool
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeAmenities.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Active Amenities</p>
          <div className="flex flex-wrap gap-2">
            {activeAmenities.map(({ key, label, icon, color }) => (
              <div key={key}
                className={`bg-gradient-to-br ${color} border rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2
                            flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 bg-white`}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VillaVisualizer;

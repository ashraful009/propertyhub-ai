const LandVisualizer = ({ property }) => {
  const l = property?.landDetails || {};
  const shape = l.plotShape || 'Rectangle';

  const renderShape = () => {
    if (shape === 'Irregular') {
      return (
        <div className="flex justify-center w-full">
          <svg viewBox="0 0 200 160" className="w-full max-w-[14rem] h-auto aspect-[5/4]">
            <polygon
              points="20,140 10,60 60,10 150,20 190,80 170,150 90,155"
              fill="rgba(34,197,94,0.1)"
              stroke="rgba(34,197,94,0.5)"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <text x="100" y="85" textAnchor="middle" fill="rgba(34,197,94,0.8)" fontSize="12" fontWeight="bold">
              {l.totalSize || '—'} Katha
            </text>
            <text x="100" y="102" textAnchor="middle" fill="rgba(156,163,175,0.7)" fontSize="10">
              Irregular Plot
            </text>
          </svg>
        </div>
      );
    }

    const ratioClass = shape === 'Square' ? 'aspect-square max-w-[12rem]' : 'aspect-[8/5] max-w-[16rem]';

    return (
      <div className="flex justify-center w-full px-2 sm:px-0">
        <div className={`w-full ${ratioClass} rounded-md border-2 border-dashed border-emerald-500/50
                         bg-emerald-500/10 flex flex-col items-center justify-center gap-1
                         transition-all duration-300`}>
          <span className="text-emerald-600 font-bold text-base sm:text-lg">{l.totalSize || '—'} Katha</span>
          <span className="text-gray-500 text-xs">{shape} Plot</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 border border-blue-100 rounded-2xl p-4 sm:p-6">
      <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
        Land Plot Preview — <strong className="text-gray-900">{shape}</strong>
      </p>
      
      {renderShape()}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-6">
        {[
          { label: 'Type', value: l.landType || '—' },
          { label: 'Status', value: l.fillingStatus || '—' },
          { label: 'Road Access', value: l.roadAccess || '—' },
          { label: 'Construction', value: l.constructionReady || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl px-2 py-2 sm:px-3 sm:py-2 text-center">
            <p className="text-gray-900 text-xs sm:text-sm font-medium">{value}</p>
            <p className="text-gray-500 text-[10px] sm:text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandVisualizer;

export default function PropertyFilter() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 text-lg mb-6">Filter Properties</h3>
      
      <div className="space-y-5">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm">
            <option value="">All Locations</option>
            <option value="dhaka">Dhaka</option>
            <option value="chittagong">Chittagong</option>
            <option value="sylhet">Sylhet</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Property Type</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm">
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Price Range</label>
          <input 
            type="range" 
            min="0" 
            max="10000000" 
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$0</span>
            <span>$10M+</span>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors mt-4">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-20 text-center mt-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Property</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          This is a dummy homepage to test our new 3D Glassmorphism sticky Navbar. Try scrolling down to see the blur effect in action!
        </p>
      </div>

      {/* স্ক্রল টেস্ট করার জন্য ফাঁকা জায়গা */}
      <div className="h-[1000px] mt-10 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-400 font-medium">Scroll down to test sticky navbar...</p>
      </div>
    </div>
  );
}
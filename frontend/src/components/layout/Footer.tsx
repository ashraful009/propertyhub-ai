export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-indigo-600">PropertyHub</span>
            <p className="text-sm text-slate-500 mt-1">
              Find your dream home with transparent installments.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} PropertyHub Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

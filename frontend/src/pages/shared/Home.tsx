import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center">

      <section className="w-full relative py-32 flex flex-col items-center text-center px-4 bg-gradient-to-b from-indigo-50 to-slate-50">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Find your dream home <br className="hidden md:block" />
          <span className="text-indigo-600">without the bank hassle.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          Direct installments with vendors. Transparent pricing. Secure bookings. Experience real estate the way it should be.
        </p>
        <Link 
          to="/search" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1"
        >
          Explore Properties
        </Link>
      </section>


      <section className="w-full max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-slate-200 rounded w-2/3 mb-4 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6 animate-pulse"></div>
                <div className="h-10 bg-indigo-100 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

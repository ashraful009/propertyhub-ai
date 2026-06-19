import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-9xl font-extrabold text-indigo-100">404</h1>
      <h2 className="text-3xl font-bold text-slate-800 mt-4">Page not found</h2>
      <p className="text-slate-600 mt-2 mb-8 text-center">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}

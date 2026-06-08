import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to PropertyHub
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Your centralized platform to discover, book, and manage premium real estate properties. The frontend authentication flow is now fully operational.
          </p>
        </div>
      </main>
    </div>
  );
}
import Logo from './Logo';
import SearchBar from './SearchBar';
import NavActions from './NavActions';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-lg border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          
          <div className="flex-shrink-0">
            <Logo />
          </div>

          
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>

          
          <div className="flex-shrink-0">
            <NavActions />
          </div>
          
        </div>
      </div>
    </nav>
  );
}
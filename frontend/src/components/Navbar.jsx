import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authUser';
import { useContentStore } from '../store/content';
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { setContentType } = useContentStore();
  return (
    <div>
      <header className="w-full mx-auto flex flex-wrap items-center justify-between p-3 px-16 h-5">
        <div className="flex items-center gap-10 z-50">
          <Link to="/">
            <img
              src="/favicon.png"
              alt="NETFLIX LOGO"
              className="w-6 sm:w-16"
            />
          </Link>
          {/* desktop navbar items */}
          <div className="hidden sm:flex gap-6 items-center">
            <Link
              to="/"
              className="hover:text-white/60 transition-colors duration-500"
              onClick={() => setContentType('movie')}
            >
              Movies
            </Link>
            <Link
              to="/"
              className="hover:text-white/60 transition-colors duration-500"
              onClick={() => setContentType('tv')}
            >
              Tv Shows
            </Link>
            <Link
              to="/history"
              className="hover:text-white/60 transition-colors duration-500"
            >
              Search History
            </Link>
          </div>
        </div>
        <div className="flex gap-5 items-center z-50">
          <Link to="/search">
            <Search className="size-6 cursor-pointer" />
          </Link>
          <img
            src={user.image}
            alt="Avatar"
            className="h-8 rounded cursor-pointer"
          />
          <LogOut className="size-6 cursor-pointer" onClick={logout} />
          <div className="sm:hidden">
            <Menu
              className="size-6 cursor-pointer"
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
            <Link className="block hover:text-white/60 transition-colors duration-500">
              Movies
            </Link>
            <Link className="block hover:text-white/60 transition-colors duration-500">
              Tv Shows
            </Link>
            <Link className="block hover:text-white/60 transition-colors duration-500">
              Search History
            </Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;

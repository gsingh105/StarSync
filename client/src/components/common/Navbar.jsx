// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between text-white">

        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold tracking-wide text-white">
          StarSync
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10 text-sm text-white ">
          <a href="#horoscopes" className=" transition">Horoscopes</a>
          <a href="#kundli" className="hover:text-gray-900 dark:hover:text-white transition">Kundli Reading</a>
          <a href="#compatibility" className="hover:text-gray-900 dark:hover:text-white transition">Love Compatibility</a>
        </div>

        <div className="flex items-center gap-6">

        
         

          {loading ? (
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
          ) : user ? (
            <div className="relative user-menu">

              {/* User Button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                <span className="hidden xl:block text-sm">
                  {user.name || user.fullName}
                </span>
                <div className="w-9 h-9 rounded-full bg-gray-700 text-white dark:bg-gray-500 flex items-center justify-center text-sm font-medium">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full rounded-full object-cover" alt="profile" />
                  ) : (
                    getInitials(user.name || user.fullName)
                  )}
                </div>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Signed in as</p>
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{user.email}</p>

                    {user.role === "astrologer" && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs border border-purple-500 text-purple-500 rounded-full">
                        Astrologer
                      </span>
                    )}
                  </div>

                  <div className="py-2">
                    <Link
                      to={user.role === "astrologer" ? "/astrologer/dashboard" : "/dashboard"}
                      className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      My Dashboard
                    </Link>
                    <Link to="/profile" className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Profile & Settings
                    </Link>
                    <Link to="/my-readings" className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      My Readings
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Section */
            <div className="flex items-center gap-5 text-sm">

              {/* Normal Login */}
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                User Login
              </Link>

              {/* ⭐ Astrologer Login Added Here */}
              <Link
                to="/astrologer/login"
                className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition"
              >
                Astrologer Login
              </Link>

              {/* CTA Button */}
              <Link
                to="/register"
                className="px-6 py-2.5 border border-gray-900 dark:border-gray-300 rounded-full text-gray-900 dark:text-gray-300 font-medium hover:bg-gray-900 dark:hover:bg-gray-300 hover:text-white dark:hover:text-black transition"
              >
                Get Free Reading
              </Link>

               <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition">
            {theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}
          </button>
            </div>
            
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

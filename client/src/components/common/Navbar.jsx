import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Menu, X as XIcon } from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close dropdowns on click outside
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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300">
            StarSync
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          {['Horoscopes', 'Kundli', 'Compatibility'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
               {item}
             </a>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "light" ? <Moon size={20}/> : <Sun size={20}/>}
          </button>

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
          ) : user ? (
            <div className="relative user-menu">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
              >
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name || user.fullName?.split(' ')[0]}
                </span>
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-500/20">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full rounded-full object-cover" alt="profile" />
                  ) : (
                    getInitials(user.name || user.fullName)
                  )}
                </div>
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate mt-1">{user.email}</p>
                    {user.role === "astrologer" && (
                       <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                         Astrologer
                       </span>
                    )}
                  </div>

                  <div className="py-2">
                    {[
                      { name: 'Dashboard', link: user.role === "astrologer" ? "/astrologer/dashboard" : "/dashboard" },
                      { name: 'Profile & Settings', link: "/profile" },
                      { name: 'My Readings', link: "/my-readings" }
                    ].map((item) => (
                      <Link 
                        key={item.name}
                        to={item.link} 
                        className="block px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-slate-800 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg shadow-gray-900/20 dark:shadow-white/10"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu (Simplified) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-4">
           {/* Add mobile links here matching desktop */}
           <Link to="/login" className="block w-full text-center py-2 border border-gray-300 dark:border-slate-700 rounded-lg">Login</Link>
           <Link to="/register" className="block w-full text-center py-2 bg-amber-500 text-white rounded-lg">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
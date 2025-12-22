import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X as XIcon, Sparkles, UserCircle, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const navItems = [
    { name: 'Horoscope', link: '/horoscope' },
    { name: 'Kundli', link: '/kundli' },
    { name: 'Matching', link: '/compatibility' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white" size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            Star<span className="text-amber-500">Sync</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                location.pathname === item.link
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse"></div>
          ) : user ? (
            <div className="relative user-menu">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-1 rounded-2xl bg-slate-900 border border-white/5 hover:border-amber-500/30 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-black shadow-md">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full rounded-xl object-cover" alt="profile" />
                  ) : (
                    user.name?.[0] || "U"
                  )}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-[#0f172a] rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-white/5 bg-slate-800/30">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Celestial Member</p>
                    <p className="text-sm font-bold text-white truncate mt-1">{user.email}</p>
                  </div>

                  <div className="p-3 space-y-1">
                    <DropdownLink to="/profile" icon={<UserCircle size={16} />} label="Profile" />
                  </div>

                  <div className="p-3 border-t border-white/5 bg-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-amber-500 transition">
                Log in
              </Link>
              <Link to="/register" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 bg-amber-500 rounded-xl hover:scale-105 transition shadow-lg shadow-amber-500/20">
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#020617] p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link key={item.name} to={item.link} className="block text-sm font-bold uppercase tracking-widest text-slate-300">
              {item.name}
            </Link>
          ))}
          <hr className="border-white/5" />
          <Link to="/login" className="block text-center py-4 font-black uppercase tracking-widest text-sm text-slate-400">Login</Link>
          <Link to="/register" className="block text-center py-4 bg-amber-500 text-slate-900 font-black uppercase tracking-widest rounded-2xl text-sm">Get Started</Link>
        </div>
      )}
    </nav>
  );
};

const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-amber-400 rounded-2xl transition-all"
  >
    {icon} {label}
  </Link>
);

export default Navbar;
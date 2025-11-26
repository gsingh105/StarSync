import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.checkAuth();
        if (!userData) navigate('/login');
        else setUser(userData);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-amber-500/20 animate-pulse"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-amber-900 selection:text-amber-100">
       {/* Background Effects */}
       <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
       <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-amber-600/5 rounded-full blur-[120px]"></div>
       </div>

      {/* Nav */}
      <nav className="relative z-50 border-b border-amber-500/10 bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
             <StarIcon className="w-5 h-5 text-amber-500" />
             <span className="font-cinzel font-bold text-amber-100">StarSync</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-cinzel text-red-400 hover:text-red-300 tracking-widest uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 border-l-2 border-amber-500 pl-6">
            <h1 className="font-cinzel text-3xl md:text-4xl text-amber-100 mb-2">
              Welcome Back, {user?.fullName}
            </h1>
            <p className="font-playfair italic text-gray-400">
              Your cosmic journey continues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile Card */}
            <div className="p-6 rounded-sm bg-[#0a0a0c] border border-amber-500/20 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <StarIcon className="w-24 h-24 text-amber-500" />
              </div>
              <h2 className="font-cinzel text-lg text-amber-200 mb-4">Soul Profile</h2>
              <div className="space-y-3 font-mono text-sm text-gray-400">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Email</span>
                  <span className="text-gray-200">{user?.email}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Role</span>
                  <span className="text-amber-500 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Joined</span>
                  <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-6 rounded-sm bg-gradient-to-br from-[#1a1625] to-[#0a0a0c] border border-amber-500/20 flex flex-col justify-center items-center text-center">
               <h3 className="font-cinzel text-lg text-amber-100 mb-2">New Reading</h3>
               <p className="font-playfair text-sm text-gray-400 italic mb-6">Consult the stars for guidance today.</p>
               <button className="px-8 py-2 border border-amber-500/40 text-amber-400 font-cinzel text-xs tracking-widest hover:bg-amber-500 hover:text-[#050505] transition-all duration-300">
                 Book Consultation
               </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
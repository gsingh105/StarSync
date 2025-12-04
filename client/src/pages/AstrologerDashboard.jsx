import React, { useState, useEffect } from 'react';
// 1. Import the NEW Astrologer Context
import { useAstrologerAuth } from '../context/AstrologerAuthContext'; 
import { useNavigate } from 'react-router-dom';
import { 
  Phone, Clock, DollarSign, Star, User, LogOut, 
  Activity, PhoneIncoming, X, RefreshCw 
} from 'lucide-react';

const AstrologerDashboard = () => {
  // 2. Use Astrologer Auth Logic (No standard useAuth)
  const { astrologer, isAuthenticated, logout, loading: authLoading, checkAstrologerSession } = useAstrologerAuth(); 
  const navigate = useNavigate();
  
  // Local State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  // Call Simulation State
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 3. Protect Route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/astrologer/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 4. Manual Refresh Handler
  const handleRefreshData = async () => {
     setIsRefreshing(true);
     await checkAstrologerSession();
     setIsRefreshing(false);
  };

  // 5. Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 6. Simulating Call Logic
  useEffect(() => {
    let callTimer;
    if (isOnline && callStatus === 'idle') {
      const randomTime = Math.floor(Math.random() * 8000) + 3000;
      callTimer = setTimeout(() => {
        setIncomingCall({
          id: 'call_123',
          userName: 'Rahul Gupta',
          type: 'audio', 
          duration: '5 mins',
          topic: 'Career & Finance',
          zodiac: 'Scorpio'
        });
        setCallStatus('ringing');
      }, randomTime);
    }
    return () => clearTimeout(callTimer);
  }, [isOnline, callStatus]);

  const handleLogout = async () => {
    await logout();
    navigate('/astrologer/login');
  };

  // Safe Data Access (Default to empty object if null during transition)
  const {
    name = "Astrologer",
    email = "",
    specialization = "General",
    experienceYears = 0,
    rating = 0,
    price = 0,
    profileImage
  } = astrologer || {};

  // --- LOADING STATE ---
  if (authLoading) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-amber-500 gap-4">
            <RefreshCw className="animate-spin w-10 h-10" />
            <h2 className="font-cinzel text-xl tracking-widest">Entering Sanctum...</h2>
        </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-amber-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); 
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .animate-ring { animation: ring 1.5s infinite; }
        @keyframes ring {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(245, 158, 11, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0a0c] border-r border-amber-900/20 z-20 hidden md:flex flex-col">
        <div className="p-6 border-b border-amber-900/20">
          <h1 className="text-xl font-cinzel text-amber-500 font-bold tracking-wider">StarSync <span className="text-xs text-amber-200/50 block font-sans tracking-widest mt-1">PARTNER</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-amber-900/10 text-amber-500 p-3 rounded-md flex items-center gap-3 border border-amber-500/20 cursor-pointer">
            <Activity size={18} /><span className="font-medium">Live Dashboard</span>
          </div>
          <div className="text-gray-500 hover:text-amber-200 hover:bg-white/5 p-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors">
            <DollarSign size={18} /><span>Earnings</span>
          </div>
        </nav>
        <div className="p-4 border-t border-amber-900/20">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium w-full p-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="md:ml-64 p-4 md:p-8 relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-cinzel text-white">Welcome, {name}</h2>
              <button onClick={handleRefreshData} disabled={isRefreshing}>
                 <RefreshCw className={`w-4 h-4 text-amber-500 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform'}`} />
              </button>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Clock size={14} /> {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0f0f11] p-2 rounded-full border border-gray-800">
            <span className={`text-sm font-medium px-3 ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
              {isOnline ? 'You are Online' : 'You are Offline'}
            </span>
            <button 
              onClick={() => { setIsOnline(!isOnline); if(isOnline) setIncomingCall(null); }}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isOnline ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Phone className="text-blue-400" />} title="Today's Calls" value="0" sub="Waiting for calls" />
          <StatCard icon={<DollarSign className="text-green-400" />} title="Earnings" value={`₹${price * 10}`} sub="Est. today" />
          <StatCard icon={<Star className="text-amber-400" />} title="Rating" value={rating} sub="Customer feedback" />
          <StatCard icon={<User className="text-purple-400" />} title="Experience" value={`${experienceYears} Yrs`} sub="Verified Expert" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Console */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1e] to-[#0a0a0c] rounded-xl border border-amber-500/10 p-1 relative overflow-hidden min-h-[400px] flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
              {!isOnline ? (
                <div className="text-center opacity-50">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><LogOut size={32} /></div>
                  <h3 className="text-xl font-cinzel text-gray-400">Offline</h3>
                </div>
              ) : callStatus === 'idle' ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-amber-900/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30 animate-pulse">
                    <Activity size={40} className="text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-cinzel text-amber-100">Waiting for connections...</h3>
                </div>
              ) : incomingCall ? (
                <div className="w-full max-w-md bg-[#0f0f11] border border-amber-500 rounded-lg p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-ring">
                  <h3 className="text-2xl font-bold text-white mb-1">{incomingCall.userName}</h3>
                  <p className="text-amber-500 text-sm mb-6 uppercase">Incoming {incomingCall.type} Call</p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => { setIncomingCall(null); setCallStatus('idle'); }} className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white"><X size={24} /></button>
                    <button onClick={() => setCallStatus('connected')} className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white animate-bounce"><PhoneIncoming size={24} /></button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-[#0f0f11] rounded-xl border border-gray-800 p-6 h-fit">
            <h3 className="text-lg font-cinzel text-amber-500 mb-4 pb-2 border-b border-gray-800">Your Profile</h3>
            <div className="flex flex-col items-center mb-6">
              
              {/* IMAGE FIX: Fallback Logic */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-purple-600 p-1 mb-3">
                 <div className="w-full h-full rounded-full bg-[#1a1a1e] overflow-hidden flex items-center justify-center border-4 border-[#1a1a1e]">
                   {profileImage ? (
                     <img 
                       src={profileImage} 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         // Hide the broken image and show the fallback icon container
                         e.target.style.display = 'none';
                         e.target.parentElement.classList.add('fallback-active');
                       }}
                     />
                   ) : null}
                   {/* Fallback Icon - Visible if no image or if image hidden via error */}
                   <User className={`text-amber-500/50 w-10 h-10 ${profileImage ? 'hidden' : 'block'} fallback-icon`} />
                   
                   {/* CSS to show icon when image fails */}
                   <style>{`
                      .fallback-active .fallback-icon { display: block !important; }
                   `}</style>
                 </div>
              </div>

              <h4 className="text-xl font-bold text-white text-center">{name}</h4>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 uppercase font-bold">Specialization</label><p className="text-sm text-gray-300">{specialization}</p></div>
              <div><label className="text-xs text-gray-500 uppercase font-bold">Rate</label><p className="text-sm text-green-400 font-mono">₹{price}/min</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, sub }) => (
  <div className="bg-[#0f0f11] p-5 rounded-lg border border-gray-800 hover:border-amber-500/30 transition-colors">
    <div className="flex justify-between items-start mb-2"><div className="p-2 bg-white/5 rounded-md text-gray-300">{icon}</div></div>
    <h4 className="text-gray-400 text-sm">{title}</h4>
    <div className="flex items-end gap-2 mt-1"><span className="text-2xl font-bold text-white">{value}</span><span className="text-xs text-gray-600 mb-1">{sub}</span></div>
  </div>
);

export default AstrologerDashboard;
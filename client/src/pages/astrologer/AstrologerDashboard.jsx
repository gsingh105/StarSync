import React, { useState, useEffect } from 'react';
import { useAstrologerAuth } from '../../context/AstrologerAuthContext'; 
import { useNavigate } from 'react-router-dom';
import { 
  Phone, Clock, DollarSign, Star, User, LogOut, 
  Activity, PhoneIncoming, X, RefreshCw, Power 
} from 'lucide-react';
import socketService from '../../services/socketService';
import LiveVideoRoom from '../../components/LiveVideoRoom';

const AstrologerDashboard = () => {
  const { astrologer, isAuthenticated, logout, loading: authLoading } = useAstrologerAuth(); 
  const navigate = useNavigate();
  
  const [isOnline, setIsOnline] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- SOCKET STATES ---
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const [liveToken, setLiveToken] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/astrologer/login');
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- SOCKET LISTENERS ---
  useEffect(() => {
      if (astrologer?._id) {
          socketService.connect(astrologer._id);

          socketService.on('incoming_call', (data) => {
              if (isOnline && callStatus === 'idle') {
                  setIncomingCall(data);
                  setCallStatus('ringing');
              }
          });

          socketService.on('call_accepted', (data) => {
              setLiveToken(data.token);
              setCallStatus('connected');
          });

          socketService.on('call_failed', () => {
             setIncomingCall(null);
             setCallStatus('idle');
             alert("Call disconnected.");
          });
      }
      return () => socketService.disconnect(); 
  }, [astrologer, isOnline, callStatus]);

  const handleLogout = async () => {
    await logout();
    navigate('/astrologer/login');
  };

  const acceptCall = () => {
      if (incomingCall && astrologer?._id) {
          socketService.emit('accept_call', {
              callerId: incomingCall.callerId,
              receiverId: astrologer._id,
              roomId: incomingCall.roomId
          });
      }
  };

  const rejectCall = () => {
      if (incomingCall) {
          socketService.emit('reject_call', { callerId: incomingCall.callerId });
          setIncomingCall(null);
          setCallStatus('idle');
      }
  };

  const handleEndCall = () => {
      setCallStatus('idle');
      setIncomingCall(null);
      setLiveToken(null);
  };

  const { name = "Astrologer", specialization = "General", experienceYears = 0, rating = 0, price = 0, profileImage } = astrologer || {};

  if (callStatus === 'connected' && liveToken) {
      return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors duration-500 font-sans">
      
      {/* --- Top Navigation --- */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Star className="text-white fill-white" size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">StarSync</h1>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Partner Dashboard</p>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all font-medium text-sm border border-transparent hover:border-red-200 dark:hover:border-red-800"
          >
            <LogOut size={16} /> 
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Namaste, {name.split(' ')[0]} 
            </h2>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
              <Clock size={16} className="text-amber-500" />
              {currentTime.toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Online Toggle */}
          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-300 ${isOnline ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
             <div className="flex flex-col">
               <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</span>
               <span className={`font-bold ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                 {isOnline ? 'Available for Calls' : 'Offline'}
               </span>
             </div>
             <button 
               onClick={() => setIsOnline(!isOnline)} 
               className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${isOnline ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
             >
               <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isOnline ? 'translate-x-6' : ''}`} />
             </button>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Phone className="text-blue-500" />} title="Today's Calls" value="0" />
          <StatCard icon={<DollarSign className="text-green-500" />} title="Earnings" value={`₹${price * 10 || 0}`} />
          <StatCard icon={<Star className="text-amber-500 fill-amber-500" />} title="Rating" value={rating || '4.9'} />
          <StatCard icon={<Activity className="text-purple-500" />} title="Experience" value={`${experienceYears} Yrs`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* --- MAIN CALL AREA --- */}
          <div className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center p-8 transition-colors duration-500">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
               <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            {!isOnline ? (
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto border border-slate-200 dark:border-slate-700">
                  <Power className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">You are Offline</h3>
                <p className="text-slate-500 dark:text-slate-500 max-w-xs mx-auto">Toggle your status to "Online" to start receiving consultation requests.</p>
              </div>
            ) : callStatus === 'ringing' && incomingCall ? (
              <div className="text-center w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-25"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900">
                    <PhoneIncoming className="w-14 h-14 text-white animate-bounce" />
                  </div>
                </div>
                
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Incoming Call Request</h3>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-10">{incomingCall.callerName}</h2>
                
                <div className="flex items-center justify-center gap-8">
                  <button 
                    onClick={rejectCall} 
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                       <X size={28} />
                    </div>
                    <span className="text-sm font-medium text-slate-500 group-hover:text-red-500 transition-colors">Decline</span>
                  </button>

                  <button 
                    onClick={acceptCall} 
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform animate-pulse">
                       <Phone size={32} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-green-500 transition-colors">Accept</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                  <Activity className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-2">Live & Listening</h3>
                <p className="text-slate-500 dark:text-slate-400">Waiting for the stars to align (and your phone to ring)...</p>
              </div>
            )}
          </div>

          {/* --- PROFILE SIDEBAR --- */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 p-1 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 mb-6">
               <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <User size={40} className="text-slate-400" />
                    </div>
                  )}
               </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full mb-6">
              {specialization}
            </span>

            <div className="w-full space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                 <span className="text-sm text-slate-500 dark:text-slate-400">Rate/min</span>
                 <span className="font-bold text-slate-900 dark:text-white">₹{price}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                 <span className="text-sm text-slate-500 dark:text-slate-400">Total Consultations</span>
                 <span className="font-bold text-slate-900 dark:text-white">1,240</span>
               </div>
            </div>

            <button className="mt-8 w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
               <RefreshCw size={16} /> Update Profile
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  </div>
);

export default AstrologerDashboard;
import React, { useState, useEffect } from 'react';
import { useAstrologerAuth } from '../context/AstrologerAuthContext'; 
import { useNavigate } from 'react-router-dom';
import { 
  Phone, Clock, DollarSign, Star, User, LogOut, 
  Activity, PhoneIncoming, X, RefreshCw 
} from 'lucide-react';
import socketService from '../services/socketService';
import LiveVideoRoom from '../components/LiveVideoRoom';

const AstrologerDashboard = () => {
  const { astrologer, isAuthenticated, logout, loading: authLoading, checkAstrologerSession } = useAstrologerAuth(); 
  const navigate = useNavigate();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // --- REAL SOCKET LISTENERS ---
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
      return () => socketService.disconnect(); // Optional cleanup
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
      // No reload
  };

  const { name = "Astrologer", specialization = "General", experienceYears = 0, rating = 0, price = 0, profileImage } = astrologer || {};

  if (callStatus === 'connected' && liveToken) {
      return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />
  }

  if (authLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">StarSync • Astrologer</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, {name}</h2>
            <p className="text-amber-700 mt-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {currentTime.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-white border border-amber-200 rounded-2xl px-6 py-4 shadow-sm">
              <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <button onClick={() => setIsOnline(!isOnline)} className={`relative w-14 h-8 rounded-full transition ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition ${isOnline ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Phone className="w-8 h-8 text-blue-600" />} title="Today's Calls" value="0" />
          <StatCard icon={<DollarSign className="w-8 h-8 text-green-600" />} title="Earnings" value={`₹${price * 10 || 0}`} />
          <StatCard icon={<Star className="w-8 h-8 text-amber-600 fill-current" />} title="Rating" value={rating || '4.9'} />
          <StatCard icon={<User className="w-8 h-8 text-purple-600" />} title="Experience" value={`${experienceYears} yrs`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* DYNAMIC CALL AREA */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-amber-100 p-10 text-center min-h-96 flex flex-col items-center justify-center">
            {!isOnline ? (
              <>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <LogOut className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600">You are currently offline</h3>
              </>
            ) : callStatus === 'ringing' && incomingCall ? (
              <div className="space-y-8 animate-in zoom-in duration-300">
                <div className="w-36 h-36 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <PhoneIncoming className="w-20 h-20 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">Incoming Call</h3>
                  <p className="text-amber-700 text-2xl mt-2 font-semibold">{incomingCall.callerName}</p>
                </div>
                <div className="flex justify-center gap-8">
                  <button onClick={rejectCall} className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                    <X className="w-10 h-10" />
                  </button>
                  <button onClick={acceptCall} className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full text-white shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                    <Phone className="w-10 h-10" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Activity className="w-14 h-14 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-amber-700">Waiting for calls...</h3>
              </>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-amber-100 p-8">
            <h3 className="text-xl font-bold text-amber-800 mb-6 text-center">My Profile</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 mb-6 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-amber-600" />
                    </div>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{name}</h4>
              <p className="text-amber-700 font-medium">{specialization}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-2xl shadow-md border border-amber-100 p-6 text-center hover:shadow-lg transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-gray-600 text-sm mt-1">{title}</p>
  </div>
);

export default AstrologerDashboard;
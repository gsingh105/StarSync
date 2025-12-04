import React, { useState, useEffect } from 'react';
import { useAstrologerAuth } from '../context/AstrologerAuthContext'; 
import { useNavigate } from 'react-router-dom';
import { 
  Phone, Clock, DollarSign, Star, User, LogOut, 
  Activity, PhoneIncoming, X, RefreshCw 
} from 'lucide-react';

const AstrologerDashboard = () => {
  const { astrologer, isAuthenticated, logout, loading: authLoading, checkAstrologerSession } = useAstrologerAuth(); 
  const navigate = useNavigate();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/astrologer/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleRefreshData = async () => {
     setIsRefreshing(true);
     await checkAstrologerSession();
     setIsRefreshing(false);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const {
    name = "Astrologer",
    email = "",
    specialization = "General",
    experienceYears = 0,
    rating = 0,
    price = 0,
    profileImage
  } = astrologer || {};

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-600 animate-spin mb-4" />
          <p className="text-amber-700 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">

      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">StarSync • Astrologer</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome + Status */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, {name}</h2>
            <p className="text-amber-700 mt-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {currentTime.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handleRefreshData} className="p-3 bg-amber-100 rounded-xl hover:bg-amber-200 transition">
              <RefreshCw className={`w-5 h-5 text-amber-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center gap-4 bg-white border border-amber-200 rounded-2xl px-6 py-4 shadow-sm">
              <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-14 h-8 rounded-full transition ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
              >
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

          {/* Live Call Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-amber-100 p-10 text-center min-h-96 flex flex-col items-center justify-center">
            {!isOnline ? (
              <>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <LogOut className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600">You are currently offline</h3>
                <p className="text-gray-500 mt-2">Turn on to receive calls</p>
              </>
            ) : callStatus === 'idle' ? (
              <>
                <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-14 h-14 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-amber-700">Waiting for calls...</h3>
                <p className="text-gray-600 mt-3">You're online and ready</p>
              </>
            ) : incomingCall ? (
              <div className="space-y-8">
                <div className="w-36 h-36 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                  <PhoneIncoming className="w-20 h-20 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{incomingCall.userName}</h3>
                  <p className="text-amber-700 text-lg mt-2">{incomingCall.topic}</p>
                </div>
                <div className="flex justify-center gap-8">
                  <button
                    onClick={() => { setIncomingCall(null); setCallStatus('idle'); }}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition transform hover:scale-110"
                  >
                    <X className="w-8 h-8 mx-auto" />
                  </button>
                  <button
                    onClick={() => setCallStatus('connected')}
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full text-white shadow-lg transition transform hover:scale-110"
                  >
                    <Phone className="w-8 h-8 mx-auto" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-amber-100 p-8">
            <h3 className="text-xl font-bold text-amber-800 mb-6 text-center">My Profile</h3>
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 mb-6 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {profileImage ? (
                    <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-amber-600" />
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-2xl font-bold text-gray-800">{name}</h4>
              <p className="text-amber-700 font-medium">{specialization}</p>
              <p className="text-gray-500 text-sm mt-1">{email}</p>

              <div className="w-full mt-8 space-y-4">
                <div className="bg-amber-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-700">{rating || '4.9'}</p>
                  <p className="text-gray-600 text-sm">Rating</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-700">{experienceYears}+ yrs</p>
                  <p className="text-gray-600 text-sm">Experience</p>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-center text-white font-bold text-xl shadow-md">
                  ₹{price}/min
                </div>
              </div>
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
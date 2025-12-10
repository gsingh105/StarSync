import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LogOut, Phone, Star } from 'lucide-react';
import astrologerService from '../services/astrologerService';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socketService';
import LiveVideoRoom from '../components/LiveVideoRoom';

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [astrologers, setAstrologers] = useState([]);
  const [filteredAstrologers, setFilteredAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');

  // Call State
  const [callStatus, setCallStatus] = useState('idle'); 
  const [liveToken, setLiveToken] = useState(null);
  const [targetAstrologer, setTargetAstrologer] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    // 1. Connect
    socketService.connect(user._id);

    // 2. Define Listeners
    const onCallAccepted = (data) => {
        setLiveToken(data.token);
        setCallStatus('incall');
    };

    const onCallRejected = () => {
        setCallStatus('idle');
        alert("Call rejected or user busy.");
    };

    const onCallFailed = (data) => {
        setCallStatus('idle');
        alert(data.message || "Call failed.");
    };

    // --- CRITICAL FIX: SEND NAMES BACK ---
    const onIncomingCall = (data) => {
         // data = { callerId, callerName, roomId }
         const accept = window.confirm(`Incoming call from ${data.callerName}. Accept?`);
         
         if(accept) {
            socketService.emit('accept_call', {
                callerId: data.callerId,
                // Pass the Caller Name back to server
                callerName: data.callerName, 
                
                receiverId: user._id,
                // Pass My Name (Astrologer) to server
                receiverName: user.fullName || user.name || "Astrologer", 
                
                roomId: data.roomId
            });
         } else {
            socketService.emit('reject_call', { callerId: data.callerId });
         }
    };

    // 3. Attach Listeners
    socketService.on('call_accepted', onCallAccepted);
    socketService.on('call_rejected', onCallRejected);
    socketService.on('call_failed', onCallFailed);
    socketService.on('incoming_call', onIncomingCall);

    // 4. Cleanup
    return () => {
        socketService.off('call_accepted');
        socketService.off('call_rejected');
        socketService.off('call_failed');
        socketService.off('incoming_call');
        socketService.disconnect();
    };
  }, [user]);

  const initiateCall = (astro) => {
      setTargetAstrologer(astro);
      setCallStatus('calling');
      
      // Ensure we send OUR name when starting the call
      socketService.emit('call_request', {
          callerId: user._id,
          callerName: user.fullName || user.name || "User", 
          receiverId: astro._id
      });
  };

  const handleEndCall = () => {
      setCallStatus('idle');
      setLiveToken(null);
      window.location.reload(); 
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await astrologerService.getAll();
        const data = Array.isArray(response) ? response : response.data || response.astrologers || [];
        setAstrologers(data);
        setFilteredAstrologers(data);
      } catch (err) {
        setError("Failed to load astrologers.");
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologers();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    let result = [...astrologers];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.name?.toLowerCase().includes(term) ||
        a.specialization?.toLowerCase().includes(term)
      );
    }
    if (specializationFilter !== 'All') {
      result = result.filter(a => a.specialization === specializationFilter);
    }
    setFilteredAstrologers(result);
  }, [searchTerm, specializationFilter, astrologers]);

  const specializations = ['All', ...new Set(astrologers.map(a => a.specialization).filter(Boolean))];

  // RENDER ROOM
  if (callStatus === 'incall' && liveToken) {
      return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 text-gray-900">
      
      {/* Call Modal */}
      {callStatus === 'calling' && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl text-center animate-pulse">
                  <h2 className="text-xl font-bold mb-4">Calling {targetAstrologer?.name}...</h2>
                  <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center animate-bounce">
                      <Phone className="w-8 h-8 text-amber-600" />
                  </div>
              </div>
          </div>
      )}

      {/* Navbar */}
      <nav className="relative z-50 border-b border-amber-200 bg-white backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
              StarSync
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-medium text-amber-700">
              Welcome, {user?.fullName || user?.name}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 border border-amber-300 rounded-full text-amber-800 hover:bg-amber-200 transition font-medium">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 mb-4">
            Sanctum of Cosmic Masters
          </h2>
          <p className="text-xl text-amber-800 font-light tracking-wide max-w-3xl mx-auto">
            Connect with enlightened souls guided by ancient wisdom
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
            <input
              type="text"
              placeholder="Seek a master..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-amber-200 rounded-2xl text-gray-800 placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition"
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-amber-200 rounded-2xl text-gray-800 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100 transition cursor-pointer appearance-none"
            >
              {specializations.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Astrologer List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAstrologers.map((astro) => (
              <div key={astro._id} className="group relative bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                  {astro.profileImage ? (
                    <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <StarIcon className="w-28 h-28 text-amber-200" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition">{astro.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-amber-600 fill-current" />
                      <span className="text-sm font-bold text-amber-700">{astro.rating || '5.0'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-700 font-medium mb-6 italic">{astro.specialization}</p>

                  <div className="flex gap-3">
                    <div className="flex-1 text-center py-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 font-bold">
                      ₹{astro.price || 99}/min
                    </div>
                    <button 
                        onClick={() => initiateCall(astro)}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
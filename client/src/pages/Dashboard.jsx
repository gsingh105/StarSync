import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Phone, Star, Sparkles, X } from 'lucide-react';
import astrologerService from '../services/astrologerService';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socketService';
import LiveVideoRoom from '../components/LiveVideoRoom';
import Navbar from '../components/common/Navbar'; // Import Shared Navbar
import Footer from '../components/common/Footer'; // Import Shared Footer

export default function Dashboard() {
  const { user } = useAuth(); // Navbar handles logout now
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

  // --- Socket Logic (Preserved) ---
  useEffect(() => {
    if (!user?._id) return;

    socketService.connect(user._id);

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

    const onIncomingCall = (data) => {
        const accept = window.confirm(`Incoming call from ${data.callerName}. Accept?`);
        if(accept) {
           socketService.emit('accept_call', {
               callerId: data.callerId,
               callerName: data.callerName, 
               receiverId: user._id,
               receiverName: user.fullName || user.name || "Astrologer", 
               roomId: data.roomId
           });
        } else {
           socketService.emit('reject_call', { callerId: data.callerId });
        }
    };

    socketService.on('call_accepted', onCallAccepted);
    socketService.on('call_rejected', onCallRejected);
    socketService.on('call_failed', onCallFailed);
    socketService.on('incoming_call', onIncomingCall);

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

  // --- Filter Logic ---
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

  // --- Render Logic ---

  if (callStatus === 'incall' && liveToken) {
      return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors duration-500">
      
      {/* 1. Shared Navbar (Handles User Name, Logout, Theme) */}
      <Navbar />

      {/* 2. Call Modal (Overlay) */}
      {callStatus === 'calling' && (
          <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border border-amber-500/30 max-w-sm w-full mx-4">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-full h-full bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center border border-amber-500">
                      <Phone className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Calling {targetAstrologer?.name}...</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Waiting for response</p>
                  <button 
                    onClick={() => setCallStatus('idle')}
                    className="w-full py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium"
                  >
                    Cancel Call
                  </button>
              </div>
          </div>
      )}

      {/* 3. Main Content with Background Effects */}
      <main className="relative pt-28 pb-20 px-6">
        
        {/* Ambient Background Globs */}
        <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
           <div className="absolute top-[-100px] left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]"></div>
           <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
               <Sparkles size={14} /> Available Astrologers
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">Cosmic Guide</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connect instantly with certified masters for clarity on love, career, and destiny.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none shadow-sm"
              />
            </div>
            <div className="relative md:w-64 group">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none shadow-sm appearance-none cursor-pointer"
              >
                {specializations.map(s => (
                  <option key={s} value={s} className="bg-white dark:bg-slate-900">{s === 'All' ? 'All Skills' : s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
               ))}
             </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Astrologer Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAstrologers.map((astro) => (
                  <div key={astro._id} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
                    
                    {/* Image Area */}
                    <div className="h-64 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {astro.profileImage ? (
                        <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                          <Star className="w-20 h-20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                         <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                         <span className="text-xs font-bold text-slate-900 dark:text-white">{astro.rating || '5.0'}</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1">{astro.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-1">{astro.specialization || "Vedic Astrology"}</p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="flex-1 text-center">
                           <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</p>
                           <p className="text-lg font-bold text-slate-900 dark:text-white">₹{astro.price || 99}<span className="text-xs font-normal text-slate-500">/min</span></p>
                        </div>
                        <button 
                            onClick={() => initiateCall(astro)}
                            className="flex-[2] py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {!loading && filteredAstrologers.length === 0 && (
             <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-lg">No astrologers found matching your criteria.</p>
             </div>
          )}

        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}
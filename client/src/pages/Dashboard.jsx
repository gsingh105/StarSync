import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Phone, Star, Sparkles, Wallet, X, Clock, Plus, Zap } from 'lucide-react';
import axios from 'axios';

// Services & Context
import astrologerService from '../services/astrologerService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socketService';

// Components
import LiveVideoRoom from '../components/LiveVideoRoom';
import Navbar from '../components/common/Navbar';
import WalletModal from '../components/auth/WalletModal';
import InsufficientBalanceModal from '../components/auth/InsufficientBalanceModal';
import RatingModal from '../components/auth/RatingModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Data States
    const [astrologers, setAstrologers] = useState([]);
    const [filteredAstrologers, setFilteredAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('All');

    // Call Flow States
    const [callStatus, setCallStatus] = useState('idle');
    const [liveToken, setLiveToken] = useState(null);
    const [targetAstrologer, setTargetAstrologer] = useState(null);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [selectedMinutes, setSelectedMinutes] = useState(5);

    // Modal & Rating States
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showInsufficientModal, setShowInsufficientModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [neededAmount, setNeededAmount] = useState(0);

    // 1. Sync Wallet from Backend
    const fetchUserData = async () => {
        try {
            const updatedUser = await authService.checkAuth();
            if (updatedUser) setUser(updatedUser);
        } catch (e) { console.error("Balance sync failed", e); }
    };

    // 2. Socket Handlers
    useEffect(() => {
        if (!user?._id) return;
        socketService.connect(user._id);

        socketService.on('call_accepted', (data) => {
            setLiveToken(data.token);
            setCallStatus('incall');
        });

        socketService.on('call_rejected', () => {
            setCallStatus('idle');
            alert("Astrologer is busy or declined the call.");
        });

        socketService.on('call_failed', (data) => {
            setCallStatus('idle');
            alert(data.message || "Connection failed.");
        });

        socketService.on('force_disconnect', (data) => {
            handleEndCall();
        });

        return () => {
            socketService.off('call_accepted');
            socketService.off('call_rejected');
            socketService.off('call_failed');
            socketService.off('force_disconnect');
            socketService.disconnect();
        };
    }, [user]);

    // 3. Call Logic
    const openDurationPicker = (astro) => {
        setTargetAstrologer(astro);
        setShowDurationModal(true);
    };

    const handleConfirmDuration = async () => {
        const mins = parseInt(selectedMinutes);
        if (isNaN(mins) || mins < 1) return alert("Enter valid minutes");

        try {
            setCallStatus('verifying');
            // Check balance but NO deduction happens here (handled by socket on accept)
            const response = await axios.post(`${API_URL}/api/call/check-balance`, {
                astrologerId: targetAstrologer._id,
                chosenMinutes: mins
            }, { withCredentials: true });

            if (response.data.success) {
                setCallStatus('calling');
                setShowDurationModal(false);
                socketService.emit('call_request', {
                    callerId: user._id,
                    callerName: user.fullName || "User",
                    receiverId: targetAstrologer._id,
                    durationSeconds: mins * 60
                });
            }
        } catch (err) {
            setCallStatus('idle');
            if (err.response?.status === 402) {
                setNeededAmount(err.response.data.requiredAmount || (mins * targetAstrologer.price));
                setShowDurationModal(false);
                setShowInsufficientModal(true);
            } else {
                alert("Server error. Ensure backend is running.");
            }
        }
    };

    const handleEndCall = () => {
        setCallStatus('idle');
        setLiveToken(null);
        setShowRatingModal(true); // Trigger Rating Popup after call
        fetchUserData(); // Sync balance since deduction happened in backend
    };

    // 4. Data Loading
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await astrologerService.getAll();
                // Safety: Ensure we always have an array
                const data = Array.isArray(response) ? response : (response.data || []);
                setAstrologers(data);
                setFilteredAstrologers(data);
            } catch (err) { setError("Failed to load data."); setAstrologers([]); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    // 5. Filter Logic
    useEffect(() => {
        if (!Array.isArray(astrologers)) return;
        let res = astrologers.filter(a =>
            (a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.specialization?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (specializationFilter === 'All' || a.specialization === specializationFilter)
        );
        setFilteredAstrologers(res);
    }, [searchTerm, specializationFilter, astrologers]);

    const specializations = ['All', ...new Set(Array.isArray(astrologers) ? astrologers.map(a => a.specialization).filter(Boolean) : [])];

    if (callStatus === 'incall' && liveToken) {
        return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#08080A] text-slate-900 dark:text-gray-100 font-sans selection:bg-amber-200">
            <Navbar />

            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Modals */}
            <WalletModal isOpen={showRechargeModal} onClose={() => setShowRechargeModal(false)} user={user} onRechargeSuccess={(b) => setUser({ ...user, walletBalance: b })} />
            <InsufficientBalanceModal isOpen={showInsufficientModal} onClose={() => setShowInsufficientModal(false)} required={neededAmount} current={user?.walletBalance || 0} onRecharge={() => { setShowInsufficientModal(false); setShowRechargeModal(true); }} />
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                astrologerId={targetAstrologer?._id}
            />

            {/* Calling Overlay */}
            {callStatus === 'calling' && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl border border-white/10">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                            <div className="relative w-full h-full bg-amber-500 rounded-full flex items-center justify-center">
                                <Phone className="text-white animate-bounce" size={28} />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Calling {targetAstrologer?.name}</h2>
                        <p className="text-slate-500 text-sm mb-8">Waiting for connection...</p>
                        <button onClick={() => setCallStatus('idle')} className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">Cancel Call</button>
                    </div>
                </div>
            )}

            {/* Duration Modal */}
            {showDurationModal && (
                <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-white/20 p-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Session Budget</h3>
                            <button onClick={() => setShowDurationModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={18} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {[5, 10, 15, 30].map(m => (
                                    <button key={m} onClick={() => setSelectedMinutes(m)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedMinutes === m ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>{m}m</button>
                                ))}
                            </div>
                            <div className="relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Custom Minutes</label>
                                <input type="number" value={selectedMinutes} onChange={(e) => { const v = e.target.value; if (v === '' || /^\d+$/.test(v)) setSelectedMinutes(v === '' ? '' : parseInt(v)); }} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-lg focus:border-amber-500" />
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex justify-between items-center">
                                <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Total Price</span>
                                <span className="text-xl font-black text-amber-600">₹{selectedMinutes * (targetAstrologer?.price || 0)}</span>
                            </div>
                            <button onClick={handleConfirmDuration} className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-slate-900/10">
                                <Zap size={16} /> Pay & Start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
                {/* Compact Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1 uppercase">Cosmic <span className="text-amber-500">Guides</span></h1>
                        <p className="text-slate-500 text-sm">Consult with top-rated spiritual mentors.</p>
                    </div>

                    {/* Integrated Wallet */}
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 pl-5 rounded-2xl shadow-sm hover:border-amber-500 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">My Balance</span>
                            <span className="text-lg font-black tracking-tight">₹{user?.walletBalance || 0}</span>
                        </div>
                        <button onClick={() => setShowRechargeModal(true)} className="h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input type="text" placeholder="Search name or skill..." className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-amber-500 font-medium text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="sm:w-56 px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-xs text-amber-600 uppercase tracking-wider cursor-pointer" value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)}>
                        {specializations.map(s => <option key={s} value={s}>{s === 'All' ? 'All Skills' : s}</option>)}
                    </select>
                </div>

                {/* Astrologer Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.isArray(filteredAstrologers) && filteredAstrologers.map((astro) => (
                            <div key={astro._id} className="group bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-amber-500/20 transition-all duration-300">
                                <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img src={astro.profileImage || "https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=1000&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={astro.name} />
                                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="text-[11px] font-black">{astro.rating || '5.0'}</span>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-black/5 text-slate-700 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wider rounded-md">{astro.specialization}</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">{astro.name}</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-5">{astro.experienceYears} Years Wisdom</p>

                                    <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Per Min</span>
                                            <span className="text-base font-black">₹{astro.price}</span>
                                        </div>
                                        <button onClick={() => openDurationPicker(astro)} className="h-11 px-6 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-all shadow-md group/btn">
                                            <Phone size={14} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Call</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
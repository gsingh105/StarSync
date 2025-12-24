import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Phone, Star, Sparkles, Wallet, X, Clock, Plus, Zap, Heart } from 'lucide-react';
import axios from 'axios';

import astrologerService from '../services/astrologerService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socketService';

import LiveVideoRoom from '../components/LiveVideoRoom';
import WalletModal from '../components/auth/WalletModal';
import InsufficientBalanceModal from '../components/auth/InsufficientBalanceModal';
import RatingModal from '../components/auth/RatingModal';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [astrologers, setAstrologers] = useState([]);
    const [filteredAstrologers, setFilteredAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('All');


    const [callStatus, setCallStatus] = useState('idle');
    const [liveToken, setLiveToken] = useState(null);
    const [targetAstrologer, setTargetAstrologer] = useState(null);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [selectedMinutes, setSelectedMinutes] = useState(5);


    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showInsufficientModal, setShowInsufficientModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [neededAmount, setNeededAmount] = useState(0);


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
        if (isNaN(mins) || mins < 1) return toast.error('Please enter a valid number', {
            style: {
                color: "#ffff",
                backgroundColor: "black",
                border: "1px solid white"
            }
        })

        try {
            setCallStatus('verifying');
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
                toast.error('Server error. Ensure backend is running', {
                    style: {
                        color: "#ffff",
                        backgroundColor: "black",
                        border: "1px solid white"
                    }
                });
            }
        }
    };

    const handleEndCall = () => {
        setCallStatus('idle');
        setLiveToken(null);
        setShowRatingModal(true);
        fetchUserData();
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await astrologerService.getAll();
                const data = Array.isArray(response) ? response : (response.data || []);
                setAstrologers(data);
                setFilteredAstrologers(data);
            } catch (err) {
                setError("Failed to load data.");
                setAstrologers([]);
            }
            finally {
                setLoading(false);
            }
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
        <div className="min-h-screen zinc-900 text-white font-sans selection:bg-amber-500/30">

            {/* Modals & Overlays */}
            <WalletModal isOpen={showRechargeModal} onClose={() => setShowRechargeModal(false)} user={user} onRechargeSuccess={(b) => setUser({ ...user, walletBalance: b })} />
            <InsufficientBalanceModal isOpen={showInsufficientModal} onClose={() => setShowInsufficientModal(false)} required={neededAmount} current={user?.walletBalance || 0} onRecharge={() => { setShowInsufficientModal(false); setShowRechargeModal(true); }} />
            <RatingModal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} astrologerId={targetAstrologer?._id} />

            {/* Animated Calling Overlay */}
            {callStatus === 'calling' && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20">
                                <Phone className="text-white animate-pulse" size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tighter">Connecting...</h2>
                        <p className="text-slate-400 text-sm mb-10 font-medium tracking-wide">Waiting for {targetAstrologer?.name} to pick up the cosmic call.</p>
                        <button onClick={() => setCallStatus('idle')} className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all">Cancel Call</button>
                    </div>
                </div>
            )}

            {/* Duration Picker Modal */}
            {showDurationModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 ">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black tracking-tighter uppercase text-amber-500">Session Setup</h3>
                            <button onClick={() => setShowDurationModal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-4 gap-3">
                                {[5, 10, 15, 30].map(m => (
                                    <button key={m} onClick={() => setSelectedMinutes(m)} className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${selectedMinutes === m ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-white/5 border-white/5 text-slate-400'}`}>{m}m</button>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Custom Minutes</label>
                                <input type="number" value={selectedMinutes} onChange={(e) => setSelectedMinutes(e.target.value)} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none font-black text-xl text-white focus:border-amber-500 transition-all" />
                            </div>
                            <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Total Energy Exchange</span>
                                    <span className="text-2xl font-black text-white">₹{selectedMinutes * (targetAstrologer?.price || 0)}</span>
                                </div>
                                <Zap className="text-amber-500" fill="currentColor" size={24} />
                            </div>
                            <button onClick={handleConfirmDuration} className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                                Initiate Connection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter mb-3 uppercase">
                            Cosmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Guides</span>
                        </h1>
                        <p className="text-slate-400 font-medium tracking-wide">Select a spiritual mentor to illuminate your path.</p>
                    </div>

                    {/* Integrated Wallet UI */}
                    <div className="flex items-center gap-5 bg-slate-900/50 border border-white/5 p-3 pl-6 rounded-[2rem] backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Energy Credit</span>
                            <span className="text-xl font-black tracking-tight text-white">₹{user?.walletBalance || 0}</span>
                        </div>
                        <button onClick={() => setShowRechargeModal(true)} className="h-12 w-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-90">
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Filter / Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                        <input type="text" placeholder="Find an expert by name or skill..." className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl outline-none focus:border-amber-500/50 font-medium text-sm text-white placeholder:text-slate-600 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="md:w-64 px-6 py-4 bg-slate-900/50 border border-white/5 rounded-2xl outline-none font-black text-[10px] text-amber-500 uppercase tracking-widest cursor-pointer appearance-none hover:border-amber-500/30 transition-all" value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)}>
                        {specializations.map(s => <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>)}
                    </select>
                </div>

                {/* Astrologer Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4].map(n => <div key={n} className="h-[400px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {Array.isArray(filteredAstrologers) && filteredAstrologers.map((astro) => (
                            <div key={astro._id} className="group bg-slate-900/30 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-amber-500/40 transition-all duration-500 hover:translate-y-[-8px]">
                                <div className="h-56 relative overflow-hidden bg-slate-800">
                                    <img src={astro.profileImage || "https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=1000&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={astro.name} />

                                    {astro.rating > 0 && (
                                        <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10">
                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-black text-white">
                                                {astro.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-amber-500/20">{astro.specialization}</span>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col ">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tight line-clamp-1">{astro.name}</h3>
                                        <Heart className="text-slate-700 hover:text-rose-500 cursor-pointer transition-colors" size={18} />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-6">{astro.experienceYears} Years Wisdom</p>

                                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Rate</span>
                                            <span className="text-xl font-black text-white tracking-tighter">₹{astro.price}<span className="text-[10px] text-slate-500 ml-1 font-medium">/min</span></span>
                                        </div>
                                        <button onClick={() => openDurationPicker(astro)} className="h-12 px-8 bg-white/5 text-white border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-xl active:scale-95 group/btn">
                                            <Phone size={14} className="group-hover/btn:fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Consult</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredAstrologers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <Search className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">No cosmic matches found</h3>
                        <p className="text-slate-500 max-w-sm">Try adjusting your filters or search terms to find a guide.</p>
                    </div>
                )}
            </main>

            {/* Background Glows (Repositioned for the grid) */}
            <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
    );
}
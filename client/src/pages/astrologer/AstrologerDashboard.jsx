import React, { useState, useEffect } from 'react';
import { useAstrologerAuth } from '../../context/AstrologerAuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Phone, Clock, DollarSign, Star, User, LogOut,
    Activity, PhoneIncoming, X, Power, TrendingUp, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import socketService from '../../services/socketService';
import LiveVideoRoom from '../../components/LiveVideoRoom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AstrologerDashboard = () => {
    const { astrologer, isAuthenticated, logout, loading: authLoading } = useAstrologerAuth();
    const navigate = useNavigate();

    const [isOnline, setIsOnline] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [callStatus, setCallStatus] = useState('idle');
    const [liveToken, setLiveToken] = useState(null);

    // Stats States
    const [stats, setStats] = useState({ totalRevenue: 0, todayRevenue: 0, totalCalls: 0 });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) navigate('/astrologer/login');
    }, [authLoading, isAuthenticated]);

    // Fetch Stats & Reviews
    // In AstrologerDashboard.jsx
    const fetchDashboardData = async () => {
        try {
            const [statsRes, reviewsRes] = await Promise.all([
                axios.get(`${API_URL}/api/astrologer/stats`, { withCredentials: true }),
                axios.get(`${API_URL}/api/astrologer/reviews`, { withCredentials: true })
            ]);

            // Use .data because axios wraps the response
            setStats(statsRes.data);
            setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        } catch (err) {
            console.error("Dashboard Fetch Error", err);
        }
    };

    useEffect(() => {
        if (astrologer?._id) {
            fetchDashboardData();
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

            socketService.on('force_disconnect', () => handleEndCall());
        }
        return () => {
            socketService.off('incoming_call');
            socketService.off('call_accepted');
            socketService.off('force_disconnect');
        };
    }, [astrologer, isOnline, callStatus]);

    const acceptCall = () => {
        if (incomingCall && astrologer?._id) {
            socketService.emit('accept_call', {
                callerId: incomingCall.callerId,
                receiverId: astrologer._id,
                roomId: incomingCall.roomId,
                durationSeconds: incomingCall.durationSeconds
            });
        }
    };

    const handleEndCall = () => {
        setCallStatus('idle');
        setIncomingCall(null);
        setLiveToken(null);
        fetchDashboardData(); // Refresh money after call
    };

    if (callStatus === 'connected' && liveToken) {
        return <LiveVideoRoom token={liveToken} onEndCall={handleEndCall} />
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] text-slate-900 dark:text-gray-100 font-sans">
            {/* --- Top Navigation --- */}
            <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b dark:border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <Star size={18} className="text-white fill-current" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight">StarSync <span className="text-amber-500 text-xs uppercase ml-1">Pro</span></h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl border dark:border-white/5">
                            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Status</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
                                    {isOnline ? 'Active' : 'Offline'}
                                </span>
                                <button
                                    onClick={() => setIsOnline(!isOnline)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${isOnline ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-6">

                {/* --- Quick Stats Bar --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard icon={<TrendingUp size={20} />} label="Today's Earnings" value={`₹${stats.todayRevenue}`} color="text-green-500" />
                    <StatCard icon={<DollarSign size={20} />} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="text-amber-500" />
                    <StatCard icon={<Phone size={20} />} label="Sessions" value={stats.totalCalls} color="text-blue-500" />
                    <StatCard icon={<Star size={20} />} label="Avg Rating" value={astrologer?.rating || '0.0'} color="text-purple-500" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* --- Center Stage: Call Handling --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative overflow-hidden bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border dark:border-white/5 p-12 flex flex-col items-center justify-center min-h-[450px] shadow-sm">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -mr-32 -mt-32"></div>

                            {callStatus === 'ringing' ? (
                                <div className="text-center z-10 animate-in zoom-in duration-300">
                                    <div className="relative w-32 h-32 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                                        <div className="relative w-full h-full bg-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                                            <PhoneIncoming size={48} className="text-white animate-bounce" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black mb-2">{incomingCall.callerName}</h2>
                                    <p className="text-slate-400 font-medium mb-10 tracking-wide uppercase text-xs">Requesting Video Consultation</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setCallStatus('idle')} className="px-8 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all border dark:border-white/5">Decline</button>
                                        <button onClick={acceptCall} className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-xl transition-transform hover:scale-105">Accept Call</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors ${isOnline ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                                        <Activity size={32} className={isOnline ? 'animate-pulse' : ''} />
                                    </div>
                                    <h3 className="text-xl font-bold">{isOnline ? 'System Live' : 'Currently Offline'}</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                        {isOnline ? 'Listening for new incoming requests from clients...' : 'Switch to online status to start receiving calls.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* --- Recent Reviews Section --- */}
                        <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border dark:border-white/5 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black flex items-center gap-2">
                                    <MessageSquare size={18} className="text-amber-500" /> Recent Feedback
                                </h3>
                            </div>
                            <div className="grid gap-4">
                                {reviews.length > 0 ? reviews.map((rev) => (
                                    <div key={rev._id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border dark:border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-sm">{rev.userId?.fullName}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} className="text-amber-500 fill-current" />)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rev.comment || "No written feedback provided."}</p>
                                    </div>
                                )) : <div className="text-center py-10 text-slate-500 text-sm italic">No reviews yet</div>}
                            </div>
                        </div>
                    </div>

                    {/* --- Side Profile Info --- */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border dark:border-white/5 p-8 text-center shadow-sm">
                            <div className="w-28 h-28 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-full mx-auto mb-6 p-1">
                                <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden border-4 border-white dark:border-[#0A0A0A]">
                                    <img src={astrologer?.profileImage} className="w-full h-full object-cover" alt="profile" />
                                </div>
                            </div>
                            <h3 className="font-black text-2xl mb-1">{astrologer?.name}</h3>
                            <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
                                {astrologer?.specialization}
                            </div>

                            <div className="space-y-3 pt-6 border-t dark:border-white/5">
                                <ProfileItem label="Consultation Fee" value={`₹${astrologer?.price}/min`} />
                                <ProfileItem label="Experience" value={`${astrologer?.experienceYears} Years`} />
                                <ProfileItem label="Location" value="India" />
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-xs font-bold hover:bg-amber-500 hover:text-white transition-all">
                                Edit Public Profile
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Helper Components ---
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-3xl border dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-white/5 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </div>
    </div>
);

const ProfileItem = ({ label, value }) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);

export default AstrologerDashboard;
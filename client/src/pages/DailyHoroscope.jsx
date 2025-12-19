import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Briefcase, Heart, ShieldCheck, Sparkles, 
    TrendingUp, Calendar, Zap 
} from 'lucide-react';

export default function DailyHoroscope() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHoroscope = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/kundli/horoscope', { withCredentials: true });
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHoroscope();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-24 space-y-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={20} />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Syncing with Cosmos</p>
        </div>
    );

    if (!data) return null;

    const bot = data.prediction.bot_response;

    return (
        <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 px-10 py-20">
            
            {/* Header Unified with Hero Style */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> Tomorrow's Energy
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    {data.zodiac}<span className="text-amber-500">.</span>
                </h2>
                <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-500/50" /> {data.date}</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span className="text-amber-400/80">Global Alignment: {bot.total_score.score}%</span>
                </div>
            </div>

            {/* Main Grid with Consistent Card Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Profession" 
                    score={bot.career.score} 
                    desc={bot.career.split_response} 
                    icon={<Briefcase size={22} />} 
                    accent="blue" 
                />
                <StatCard 
                    title="Health" 
                    score={bot.health.score} 
                    desc={bot.health.split_response} 
                    icon={<ShieldCheck size={22} />} 
                    accent="emerald" 
                />
                <StatCard 
                    title="Love" 
                    score={bot.relationship.score} 
                    desc={bot.relationship.split_response} 
                    icon={<Heart size={22} />} 
                    accent="rose" 
                />
                <StatCard 
                    title="Finance" 
                    score={bot.finances.score} 
                    desc={bot.finances.split_response} 
                    icon={<TrendingUp size={22} />} 
                    accent="amber" 
                />
            </div>

            {/* Overall Prediction Section Unified with Feature Section Style */}
            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 shrink-0">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">Grand Cosmic Summary</h4>
                        <p className="text-xl md:text-2xl text-slate-200 font-bold leading-tight tracking-tight">
                            "{bot.total_score.split_response}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, score, desc, icon, accent }) => {
    const colors = {
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
        rose: "text-rose-400 border-rose-500/20 bg-rose-500/10",
        amber: "text-amber-400 border-amber-500/20 bg-amber-500/10"
    };

    const progressColors = {
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        rose: "bg-rose-500",
        amber: "bg-amber-500"
    };

    return (
        <div className="group bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between h-full">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[accent]} transition-transform duration-500 group-hover:rotate-6`}>
                        {icon}
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</div>
                        <div className="text-2xl font-black text-white">{score}%</div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {desc}
                    </p>
                </div>
            </div>

            <div className="mt-8 space-y-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${progressColors[accent]}`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
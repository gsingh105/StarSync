import React, { useState } from 'react';
import axios from 'axios';
import { 
    Heart, Sparkles, Zap, RefreshCw, CheckCircle2, 
    ShieldAlert, User, Calendar, Clock, MapPin, 
    ArrowRightLeft, Info, Trophy, Search 
} from 'lucide-react';

const MatchingPage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    // Initial State with lat/lon as null to force selection
    const initialPartnerState = { 
        name: '', day: '', month: '', year: '', 
        hour: '', min: '', lat: null, lon: null, 
        tzone: 5.5, place: '' 
    };

    const [p1, setP1] = useState({ ...initialPartnerState });
    const [p2, setP2] = useState({ ...initialPartnerState });

    const handleMatch = async () => {
        if (!p1.lat || !p2.lat) {
            return alert("Please search and select a birth city for both individuals.");
        }
        if (!p1.day || !p1.month || !p1.year || !p2.day || !p2.month || !p2.year) {
            return alert("Please fill in all birth date fields.");
        }

        setLoading(true);
        try {
            const matchData = {
                p1: { 
                    dob: `${String(p1.day).padStart(2, '0')}/${String(p1.month).padStart(2, '0')}/${p1.year}`, 
                    tob: `${String(p1.hour || '0').padStart(2, '0')}:${String(p1.min || '0').padStart(2, '0')}`, 
                    lat: p1.lat, lon: p1.lon, tz: p1.tzone 
                },
                p2: { 
                    dob: `${String(p2.day).padStart(2, '0')}/${String(p2.month).padStart(2, '0')}/${p2.year}`, 
                    tob: `${String(p2.hour || '0').padStart(2, '0')}:${String(p2.min || '0').padStart(2, '0')}`, 
                    lat: p2.lat, lon: p2.lon, tz: p2.tzone 
                }
            };

            const res = await axios.post('http://localhost:3000/api/kundli/matching', matchData, { withCredentials: true });
            setResult(res.data.response);
        } catch (err) {
            console.error("Matching Error:", err.response?.data);
            alert("Calculation failed. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 py-30">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={14} fill="currentColor" /> Synastry Report
                </div>
                <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    Matching<span className="text-rose-500">.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
                    Search birth locations for both individuals to calculate precise cosmic compatibility.
                </p>
            </div>

            {!result ? (
                <div className="space-y-10">
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
                            <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-rose-600 flex items-center justify-center text-white shadow-2xl border-4 border-slate-50 dark:border-[#020617]">
                                <ArrowRightLeft size={24} />
                            </div>
                        </div>
                        
                        {/* Dynamic Partner Forms */}
                        <PartnerForm title="First Individual" accent="blue" state={p1} setState={setP1} />
                        <PartnerForm title="Second Individual" accent="rose" state={p2} setState={setP2} />
                    </div>

                    <button 
                        onClick={handleMatch}
                        disabled={loading}
                        className="w-full py-6 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-black rounded-3xl hover:bg-amber-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                    >
                        {loading ? <RefreshCw className="animate-spin" /> : <Zap fill="currentColor" size={20} />}
                        {loading ? "Synchronizing..." : "Generate Compatibility Report"}
                    </button>
                </div>
            ) : (
                <div className="animate-in zoom-in duration-700 space-y-10">
                    {/* Score View (Keeping consistent with your previously working code) */}
                    <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 backdrop-blur-xl p-16 rounded-[4rem] text-center space-y-6 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] -mr-48 -mt-48"></div>
                        <h2 className="text-9xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {result?.guna?.score || 0}<span className="text-slate-300 dark:text-slate-700 text-4xl font-light">/36</span>
                        </h2>
                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-2xl font-bold text-rose-500 uppercase tracking-tighter italic italic">
                                "{result?.guna?.conclusion?.status || "Analysis Complete"}"
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {result?.guna?.conclusion?.report}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <ManglikCard name={p1.name || "Person 1"} data={result?.manglik?.p1} />
                        <ManglikCard name={p2.name || "Person 2"} data={result?.manglik?.p2} />
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-900/20 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <GunaCard label="Varna" score={result?.guna?.varna?.received_points} total="1" />
                            <GunaCard label="Vashya" score={result?.guna?.vashya?.received_points} total="2" />
                            <GunaCard label="Tara" score={result?.guna?.tara?.received_points} total="3" />
                            <GunaCard label="Yoni" score={result?.guna?.yoni?.received_points} total="4" />
                            <GunaCard label="Maitri" score={result?.guna?.maitri?.received_points} total="5" />
                            <GunaCard label="Gana" score={result?.guna?.gana?.received_points} total="6" />
                            <GunaCard label="Bhakoot" score={result?.guna?.bhakoot?.received_points} total="7" />
                            <GunaCard label="Nadi" score={result?.guna?.nadi?.received_points} total="8" />
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={() => setResult(null)} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                            New Calculation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- REUSABLE PARTNER FORM COMPONENT --- */

const PartnerForm = ({ title, accent, state, setState }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleCitySearch = async (query) => {
        setState({ ...state, place: query });
        if (query.length > 3) {
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
                setSuggestions(res.data);
            } catch (err) { console.error("Search error", err); }
        }
    };

    const selectCity = (city) => {
        setState({
            ...state,
            place: city.display_name,
            lat: parseFloat(city.lat),
            lon: parseFloat(city.lon)
        });
        setSuggestions([]);
    };

    return (
        <div className="bg-white dark:bg-slate-900/60 p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 space-y-8 shadow-sm ">
            <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                <div className={`w-2 h-2 rounded-full ${accent === 'blue' ? 'bg-blue-500' : 'bg-rose-500'}`} /> 
                {title}
            </h3>

            {/* Name Input */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2"><User size={12} /> Identity</label>
                <input type="text" placeholder="Enter name" value={state.name} className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500/30 transition-all text-sm font-bold dark:text-white" onChange={(e) => setState({...state, name: e.target.value})} />
            </div>

            {/* City Search Integration */}
            <div className="space-y-2 relative">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2"><MapPin size={12} /> Birth Place</label>
                <div className="relative group">
                    <input 
                        type="text" placeholder="Search city..." value={state.place} 
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none border-2 border-transparent focus:border-amber-500/30 transition-all text-sm font-bold dark:text-white"
                        onChange={(e) => handleCitySearch(e.target.value)} 
                    />
                    <Search className="absolute right-5 top-5 text-slate-400" size={18} />
                </div>
                {suggestions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl mt-2 border dark:border-white/10 overflow-hidden backdrop-blur-xl">
                        {suggestions.map((c, i) => (
                            <div key={i} className="p-4 text-xs dark:text-slate-300 hover:bg-amber-500 hover:text-white cursor-pointer border-b dark:border-white/5 last:border-0" onClick={() => selectCity(c)}>
                                {c.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2"><Calendar size={12} /> Date</label>
                    <div className="grid grid-cols-3 gap-2">
                        <input type="number" placeholder="DD" value={state.day} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-center font-bold dark:text-white" onChange={(e) => setState({...state, day: e.target.value})} />
                        <input type="number" placeholder="MM" value={state.month} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-center font-bold dark:text-white" onChange={(e) => setState({...state, month: e.target.value})} />
                        <input type="number" placeholder="YYYY" value={state.year} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-center font-bold dark:text-white" onChange={(e) => setState({...state, year: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2"><Clock size={12} /> Time</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="HH" value={state.hour} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-center font-bold dark:text-white" onChange={(e) => setState({...state, hour: e.target.value})} />
                        <input type="number" placeholder="MM" value={state.min} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none text-center font-bold dark:text-white" onChange={(e) => setState({...state, min: e.target.value})} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- OTHER HELPER COMPONENTS --- */

const ManglikCard = ({ name, data }) => {
    if (!data) return <div className="p-8 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 animate-pulse" />;
    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${data.is_manglik ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
                    <h4 className={`text-2xl font-black ${data.is_manglik ? 'text-rose-500' : 'text-emerald-500'} tracking-tighter uppercase`}>
                        {data.is_manglik ? 'Manglik' : 'Pure Soul'}
                    </h4>
                </div>
                <div className={`p-3 rounded-2xl ${data.is_manglik ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {data.is_manglik ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
                </div>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {data.manglik_report}
            </p>
        </div>
    );
};

const GunaCard = ({ label, score, total }) => (
    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl text-center border border-slate-100 dark:border-white/5 hover:border-amber-500/30 transition-colors">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">
            {score ?? 0}<span className="text-xs text-slate-300 dark:text-slate-700 ml-1">/ {total}</span>
        </p>
    </div>
);

export default MatchingPage;
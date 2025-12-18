import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KundliChart from './../components/auth/KundliChart.jsx';
import { 
    Trash, PlusCircle, MapPin, Sparkles, 
    RefreshCw, Calendar, Clock, Navigation,
    History, Zap, Timer, Star, Award
} from "lucide-react";

export default function KundliPage() {
    // --- State Management ---
    const [formData, setFormData] = useState({ 
        day: '', month: '', year: '', 
        hour: '', min: '', lat: '', 
        lon: '', tzone: 5.5, place: '' 
    });
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(true);

    const planetNames = { 
        Su: "Sun", Mo: "Moon", Ma: "Mars", Ra: "Rahu", 
        Ju: "Jupiter", Sa: "Saturn", Me: "Mercury", Ke: "Ketu", Ve: "Venus" 
    };

    // --- 1. Load Saved Data on Mount ---
    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/kundli/saved', { withCredentials: true });
                if (res.data.data) {
                    setChartData(res.data.data);
                    setIsFormVisible(false);
                }
            } catch (err) {
                console.log("No saved kundli found");
            }
        };
        fetchSaved();
    }, []);

    // --- 2. Address Search (Optimized) ---
    const handleCitySearch = async (query) => {
        setFormData({ ...formData, place: query });
        if (query.length > 3) {
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
                setCitySuggestions(res.data);
            } catch (err) {
                console.error("Geocoding error", err);
            }
        }
    };

    const selectCity = (city) => {
        setFormData({
            ...formData,
            place: city.display_name,
            lat: parseFloat(city.lat),
            lon: parseFloat(city.lon)
        });
        setCitySuggestions([]);
    };

    // --- 3. Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.lat || !formData.lon) return alert("Please select a city from the list.");
        
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/kundli/generate', formData, { withCredentials: true });
            setChartData(res.data.data);
            setIsFormVisible(false);
        } catch (err) {
            alert(err.response?.data?.message || "Error generating Kundli");
        } finally {
            setLoading(false);
        }
    };

    // --- 4. Delete Data ---
    const handleDelete = async () => {
        if (window.confirm("Permanently remove saved birth details?")) {
            try {
                await axios.delete('http://localhost:3000/api/kundli/delete', { withCredentials: true });
                setChartData(null);
                setIsFormVisible(true);
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-[#f8fafc] dark:bg-[#020617] pb-20 font-sans selection:bg-amber-200">
            <div className="max-w-7xl mx-auto">
                
                {isFormVisible ? (
                    /* --- BIRTH DETAILS FORM --- */
                    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 text-center text-white">
                                <Sparkles className="mx-auto mb-4 opacity-80" size={32} />
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Cosmic Profiler</h2>
                                <p className="text-amber-100 text-sm mt-2 font-medium">Decode your destiny through the stars</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                                        <Navigation size={14} /> Birth Location
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text" placeholder="Search birth city..."
                                            value={formData.place}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-amber-500/50 outline-none transition-all text-sm font-medium"
                                            onChange={e => handleCitySearch(e.target.value)}
                                        />
                                        {citySuggestions.length > 0 && (
                                            <div className="absolute z-50 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl mt-3 border dark:border-white/10 overflow-hidden backdrop-blur-xl">
                                                {citySuggestions.map((c, i) => (
                                                    <div key={i} className="p-4 text-xs hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer border-b dark:border-white/5 last:border-0" onClick={() => selectCity(c)}>
                                                        <span className="font-bold text-amber-600">📍</span> {c.display_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                                            <Calendar size={14} /> Birth Date
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <InputField placeholder="DD" onChange={e => setFormData({ ...formData, day: e.target.value })} />
                                            <InputField placeholder="MM" onChange={e => setFormData({ ...formData, month: e.target.value })} />
                                            <InputField placeholder="YYYY" onChange={e => setFormData({ ...formData, year: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                                            <Clock size={14} /> Birth Time
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField placeholder="HH" onChange={e => setFormData({ ...formData, hour: e.target.value })} />
                                            <InputField placeholder="Min" onChange={e => setFormData({ ...formData, min: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-black rounded-2xl hover:bg-amber-600 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest transition-transform active:scale-95">
                                    {loading ? <RefreshCw className="animate-spin" /> : "Reveal My Destiny"}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    /* --- RESULTS DASHBOARD --- */
                    <div className="space-y-10 animate-in fade-in duration-1000">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-black dark:text-white tracking-tighter">Your Cosmic Map</h1>
                                <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">Vedic Birth Chart & Timeline</p>
                            </div>
                            <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border dark:border-white/5">
                                <button onClick={() => setIsFormVisible(true)} className="flex items-center gap-2 px-6 py-3 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl font-bold text-xs transition-all">
                                    <PlusCircle size={16} /> New Chart
                                </button>
                                <div className="w-[1px] bg-slate-100 dark:bg-white/5 mx-2" />
                                <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-bold text-xs transition-all">
                                    <Trash size={16} /> Reset
                                </button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-5">
                                <div className="sticky top-28 space-y-6">
                                    <KundliChart data={chartData} />
                                    
                                    {/* Cosmic Luck Sidebar */}
                                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/20 transition-all" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-amber-500 flex items-center gap-2">
                                            <Award size={16} /> Cosmic Luck
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6 relative z-10">
                                            <LuckItem label="Lucky Gem" value={chartData.lucky_gem[0]} icon="💎" />
                                            <LuckItem label="Lucky Number" value={chartData.lucky_num[0]} icon="🔢" />
                                            <LuckItem label="Lucky Color" value={chartData.lucky_colors[0]} icon="🎨" />
                                            <LuckItem label="Alphabet" value={chartData.lucky_letters[0]} icon="🅰️" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-7 space-y-8">
                                {/* Key Stats */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <InsightCard title="Zodiac" value={chartData.rasi} icon="🌙" />
                                    <InsightCard title="Star" value={chartData.nakshatra} icon="✨" />
                                    <InsightCard title="Ascendant" value={chartData[0].zodiac} icon="🌅" />
                                </div>

                                {/* Interpretations */}
                                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-8">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white border-b dark:border-white/5 pb-4 uppercase tracking-tighter flex items-center gap-2">
                                        <Star className="text-amber-500" size={20} /> Deep Interpretations
                                    </h3>
                                    <div className="grid gap-8">
                                        <InterpretSection 
                                            title="Your Core Persona"
                                            desc={`Your Lagna (Ascendant) is ${chartData[0].zodiac}. This defines your physical outlook and natural temperament as ${chartData[0].zodiac_lord === 'Mercury' ? 'intellectual and communicative' : 'determined and resilient'}.`}
                                        />
                                        <InterpretSection 
                                            title="Planet Strength (Avastha)"
                                            desc={`Your Sun sits in the '${chartData[1].basic_avastha}' state. This suggests your vitality and soul purpose are ${chartData[1].basic_avastha === 'Yuva' ? 'exceptionally potent' : 'naturally evolving'} in this lifetime.`}
                                        />
                                        <InterpretSection 
                                            title="Current Energy (Dasha)"
                                            desc={`You are navigating the ${planetNames[chartData.current_dasa.split('>')[0]]} Dasha. This is a ${chartData.current_dasa.includes('Ke') ? 'spiritual and introspective' : 'materially focused and action-oriented'} phase.`}
                                        />
                                    </div>
                                </div>

                        
                                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-8">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Life Timeline</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <DashaCard level="Major Chapter" planet={planetNames[chartData.current_dasa.split('>')[0]]} icon={<History size={18}/>} color="from-purple-500 to-indigo-600" />
                                        <DashaCard level="Current Phase" planet={planetNames[chartData.current_dasa.split('>')[1]]} icon={<Zap size={18}/>} color="from-blue-500 to-cyan-600" />
                                        <DashaCard level="Sub-Period" planet={planetNames[chartData.current_dasa.split('>')[2]]} icon={<Timer size={18}/>} color="from-emerald-500 to-teal-600" />
                                    </div>
                                    <p className="text-center text-[11px] text-slate-400 font-medium uppercase tracking-widest">
                                        Current Major Cycle Started: {chartData.current_dasa_time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


const InputField = (props) => (
    <input {...props} className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-transparent focus:border-amber-500/50 outline-none transition-all text-sm font-bold text-center" />
);

const InsightCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-white/5 flex items-center gap-4 hover:border-amber-500/30 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-2xl">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <p className="text-xl font-black dark:text-white leading-none mt-1">{value}</p>
        </div>
    </div>
);

const LuckItem = ({ label, value, icon }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-black flex items-center gap-2">{icon} {value}</p>
    </div>
);

const DashaCard = ({ level, planet, icon, color }) => (
    <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-transparent hover:border-amber-500/30 transition-all group">
        <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform group-hover:scale-110`}>{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{level}</p>
                <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">{planet}</h4>
            </div>
        </div>
    </div>
);

const InterpretSection = ({ title, desc }) => (
    <div className="group">
        <h4 className="text-xs font-black uppercase text-amber-600 mb-2 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform" /> {title}
        </h4>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            {desc}
        </p>
    </div>
);
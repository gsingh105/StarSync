import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LogOut, TrendingUp, PieChart as PieIcon, MessageCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- IMPORTS ---
import astrologerService from '../services/astrologerService'; 
// 1. Import AuthContext
import { useAuth } from '../context/AuthContext'; 

// --- Icons ---
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// --- Chart Colors (Amber Theme) ---
const COLORS = ['#f59e0b', '#b45309', '#78350f', '#fbbf24', '#d97706', '#92400e'];

export default function Dashboard() {
  // 2. Destructure user and logout from AuthContext
  const { user, logout } = useAuth();
  
  const navigate = useNavigate();
  
  // State for Data
  const [astrologers, setAstrologers] = useState([]);
  const [filteredAstrologers, setFilteredAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');

  // Fetch REAL Astrologer Data on Mount
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await astrologerService.getAll();
        
        let dataArray = [];
        
        // Handle different backend response structures
        if (response.data && Array.isArray(response.data)) {
            dataArray = response.data;
        } 
        else if (Array.isArray(response)) {
            dataArray = response;
        }
        else if (response.astrologers && Array.isArray(response.astrologers)) {
            dataArray = response.astrologers;
        }

        setAstrologers(dataArray);
        setFilteredAstrologers(dataArray);
      } catch (err) {
        console.error("Failed to load astrologers", err);
        setError(typeof err === 'string' ? err : "Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  // 3. Update Handle Logout to use Context
  const handleLogout = async () => {
    try {
        await logout(); // Calls authService.logout() AND clears context state
        navigate('/login');
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  // Search & Filter Logic
  useEffect(() => {
    if (!Array.isArray(astrologers)) return;

    let result = [...astrologers];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(astro => 
        (astro.name && astro.name.toLowerCase().includes(lowerTerm)) || 
        (astro.specialization && astro.specialization.toLowerCase().includes(lowerTerm))
      );
    }

    if (specializationFilter !== 'All') {
      result = result.filter(astro => astro.specialization === specializationFilter);
    }

    setFilteredAstrologers(result);
  }, [searchTerm, specializationFilter, astrologers]);

  // Prepare Chart Data
  const chartData = useMemo(() => {
    if (!Array.isArray(astrologers) || !astrologers.length) return { pieData: [], barData: [] };

    const counts = {};
    const ratingSums = {};
    const ratingCounts = {};

    astrologers.forEach(astro => {
      const spec = astro.specialization || 'General';

      counts[spec] = (counts[spec] || 0) + 1;
      
      if (!ratingSums[spec]) {
        ratingSums[spec] = 0;
        ratingCounts[spec] = 0;
      }
      ratingSums[spec] += (Number(astro.rating) || 0);
      ratingCounts[spec] += 1;
    });

    const pieData = Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));

    const barData = Object.keys(ratingSums).map(key => ({
      name: key,
      rating: parseFloat((ratingSums[key] / ratingCounts[key]).toFixed(1))
    }));

    return { pieData, barData };
  }, [astrologers]);

  const specializations = useMemo(() => {
      if (!Array.isArray(astrologers)) return ['All'];
      const specs = astrologers.map(a => a.specialization).filter(Boolean);
      return ['All', ...new Set(specs)];
  }, [astrologers]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0c] border border-amber-500/30 p-3 rounded shadow-xl">
          <p className="font-cinzel text-amber-100 text-sm mb-1">{label || payload[0].name}</p>
          <p className="text-amber-500 text-xs font-bold">
            {payload[0].value} {payload[0].payload.rating ? 'Stars' : 'Experts'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans pb-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); .font-cinzel { font-family: 'Cinzel', serif; }`}</style>
      
      {/* --- Top Navbar --- */}
      <nav className="border-b border-amber-500/20 bg-[#0a0a0c]/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <StarIcon className="w-5 h-5 text-amber-500" />
             <h1 className="text-xl font-cinzel font-bold text-amber-100 tracking-widest">StarSync Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
             {/* 4. Display User FullName from Context */}
             <span className="hidden md:inline text-xs font-cinzel text-amber-500/60 uppercase tracking-widest">
                Logged in as {user?.fullName || user?.name || 'User'}
             </span>
             <button 
               onClick={handleLogout} 
               className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase hover:text-red-300 transition-colors border border-red-900/30 px-3 py-1.5 rounded-sm hover:bg-red-900/10"
             >
               <LogOut className="w-3 h-3" /> Sign Out
             </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* --- Header Section --- */}
        <div className="mb-12 border-l-2 border-amber-500 pl-6">
          <h2 className="font-cinzel text-3xl md:text-4xl text-amber-100 mb-2">Sanctum of Wisdom</h2>
          <p className="font-playfair italic text-gray-400">Connect with masters of the ancient arts.</p>
        </div>

        {/* --- Analytics Graphs Section --- */}
        {!loading && !error && astrologers.length > 0 && (
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Distribution */}
            <div className="bg-[#0a0a0c] border border-amber-500/10 p-6 rounded-sm shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-6 border-b border-amber-500/10 pb-2">
                <PieIcon className="w-4 h-4 text-amber-500" />
                <h3 className="font-cinzel text-lg text-amber-100">Distribution of Arts</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="middle" 
                      align="right" 
                      layout="vertical"
                      iconType="circle"
                      formatter={(value) => <span className="text-gray-400 text-xs font-cinzel ml-2">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Average Ratings */}
            <div className="bg-[#0a0a0c] border border-amber-500/10 p-6 rounded-sm shadow-lg group hover:border-amber-500/30 transition-colors">
               <div className="flex items-center gap-2 mb-6 border-b border-amber-500/10 pb-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h3 className="font-cinzel text-lg text-amber-100">Avg. Rating by Specialization</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.barData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'Cinzel' }} 
                      axisLine={{ stroke: '#333' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 5]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(245, 158, 11, 0.05)'}} />
                    <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
                      {chartData.barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* --- Search & Filter Bar --- */}
        <div className="mb-10 bg-[#0a0a0c] border border-amber-500/20 p-4 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            {/* Search Input */}
            <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search by name or art..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#121212] border border-amber-500/20 rounded-sm py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600"
                />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full md:w-1/4">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <select 
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="w-full bg-[#121212] border border-amber-500/20 rounded-sm py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                >
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* --- Astrologer Grid --- */}
        {loading ? (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
        ) : error ? (
            <div className="text-center py-20 border border-red-500/20 rounded-sm bg-[#0a0a0c]/50">
               <p className="font-playfair text-red-400 italic">{error}</p>
               <button onClick={() => window.location.reload()} className="mt-4 text-amber-500 hover:underline text-sm">Retry Connection</button>
            </div>
        ) : filteredAstrologers.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-amber-500/20 rounded-sm bg-[#0a0a0c]/50">
               <p className="font-playfair text-gray-500 italic">No masters found matching your criteria.</p>
               <button onClick={() => {setSearchTerm(''); setSpecializationFilter('All');}} className="mt-4 text-amber-500 hover:underline text-sm">Clear Filters</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAstrologers.map((astro) => (
                    <div key={astro._id} className="bg-[#0a0a0c] border border-amber-500/20 rounded-sm overflow-hidden hover:border-amber-500/50 transition-all duration-300 group flex flex-col relative">
                        
                        {/* Image / Placeholder */}
                        <div className="h-48 bg-[#121212] relative overflow-hidden">
                            {astro.profileImage ? (
                                <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a1625] to-[#0a0a0c]">
                                    <StarIcon className="w-16 h-16 text-amber-500/10" />
                                </div>
                            )}
                            {/* Experience Badge */}
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-sm border border-amber-500/30">
                                <span className="text-[10px] font-cinzel text-amber-400">{astro.experienceYears} Yrs Exp</span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-cinzel text-lg text-amber-100 truncate pr-2">{astro.name}</h3>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-900/20 px-1.5 py-0.5 rounded-sm border border-amber-500/20">
                                    <StarIcon className="w-3 h-3 fill-current" />
                                    {astro.rating ? Number(astro.rating).toFixed(1) : "N/A"}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <span className="inline-block px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[10px] font-cinzel text-amber-300 uppercase tracking-wider rounded-sm">
                                    {astro.specialization}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto grid grid-cols-2 gap-3">
                                {/* Price Display */}
                                <div className="py-2 border border-amber-500/30 bg-amber-500/5 text-amber-200 text-xs font-cinzel flex items-center justify-center gap-1">
                                    <span className="text-sm font-bold">₹{astro.price || 50}</span>/min
                                </div>
                                
                                {/* Chat Now Button */}
                                <button className="py-2 bg-amber-700 hover:bg-amber-600 text-[#050505] text-xs font-cinzel font-bold transition-all uppercase flex items-center justify-center gap-2">
                                    <MessageCircle className="w-3 h-3" />
                                    Chat Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
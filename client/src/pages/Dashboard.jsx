import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LogOut, TrendingUp, PieChart as PieIcon, MessageCircle, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import astrologerService from '../services/astrologerService';
import { useAuth } from '../context/AuthContext';

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const COLORS = ['#f59e0b', '#f97316', '#ea580c', '#dc2626', '#92400e', '#7c2d12'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [astrologers, setAstrologers] = useState([]);
  const [filteredAstrologers, setFilteredAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await astrologerService.getAll();
        const data = Array.isArray(response) ? response : response.data || response.astrologers || [];
        setAstrologers(data);
        setFilteredAstrologers(data);
      } catch (err) {
        setError("Failed to load astrologers. Please try again.");
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

  const { pieData, barData } = useMemo(() => {
    if (!astrologers.length) return { pieData: [], barData: [] };
    const specCount = {};
    const ratingSum = {}, ratingCount = {};

    astrologers.forEach(a => {
      const spec = a.specialization || "General";
      specCount[spec] = (specCount[spec] || 0) + 1;
      ratingSum[spec] = (ratingSum[spec] || 0) + (Number(a.rating) || 0);
      ratingCount[spec] = (ratingCount[spec] || 0) + 1;
    });

    const pie = Object.keys(specCount).map(k => ({ name: k, value: specCount[k] }));
    const bar = Object.keys(ratingSum).map(k => ({
      name: k,
      rating: Number((ratingSum[k] / ratingCount[k]).toFixed(1))
    }));

    return { pieData: pie, barData: bar };
  }, [astrologers]);

  const specializations = ['All', ...new Set(astrologers.map(a => a.specialization).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 text-gray-900">

      {/* Subtle Golden Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-1/3 w-80 h-80 bg-amber-400 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar - Light */}
      <nav className="relative z-50 border-b border-amber-200  bg-white backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-amber-400 opacity-40 scale-150" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
              StarSync
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-medium text-amber-700">
              Welcome, {user?.fullName || user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 border border-amber-300 rounded-full text-amber-800 hover:bg-amber-200 transition font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Hero Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 mb-4">
            Sanctum of Cosmic Masters
          </h2>
          <p className="text-xl text-amber-800 font-light tracking-wide max-w-3xl mx-auto">
            Connect with enlightened souls guided by ancient wisdom and celestial light
          </p>
        </div>

        {/* Charts Section */}
        {astrologers.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            <div className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-100 transition group">
              <div className="flex items-center gap-3 mb-6">
                <PieIcon className="w-7 h-7 text-amber-600" />
                <h3 className="text-2xl font-bold text-amber-800">Masters by Art</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#333', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-100 transition group">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-7 h-7 text-amber-600" />
                <h3 className="text-2xl font-bold text-amber-800">Rating Excellence</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fill: '#666' }} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
            <input
              type="text"
              placeholder="Seek a master by name or art..."
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

        {/* Astrologer Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/80 border border-red-200 rounded-3xl">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-amber-600 hover:underline font-medium">Retry</button>
          </div>
        ) : filteredAstrologers.length === 0 ? (
          <div className="text-center py-20 bg-white/80 border border-amber-200 rounded-3xl">
            <p className="text-amber-700 text-xl italic">No enlightened souls match your search.</p>
            <button onClick={() => { setSearchTerm(''); setSpecializationFilter('All'); }} className="mt-4 text-amber-600 hover:underline font-medium">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAstrologers.map((astro) => (
              <div
                key={astro._id}
                className="group relative bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-100 transition-all duration-500 transform hover:-translate-y-4"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-100/50 to-transparent" />
                </div>

                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                  {astro.profileImage ? (
                    <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <StarIcon className="w-28 h-28 text-amber-200" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-amber-300">
                    <span className="text-sm font-bold text-amber-700">{astro.experienceYears} yrs</span>
                  </div>
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
                    <button className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-300 hover:shadow-amber-400 transition-all flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
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
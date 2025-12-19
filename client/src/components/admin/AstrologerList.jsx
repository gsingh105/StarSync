import React, { useEffect, useState, useMemo } from 'react';
import astrologerService from '../../services/astrologerService';
import {
  Edit2, Trash2, X, Save, User, Star, Search, Filter, RefreshCcw, Award, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AstrologerList = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // --- Edit State ---
  const [editingAstro, setEditingAstro] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Data
  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      const data = await astrologerService.getAll();
      setAstrologers(data.data || data || []);
    } catch (err) {
      setError("Failed to load astrologers.");
    } finally {
      setLoading(false);
    }
  };

  // --- Filter Logic ---
  const filteredAstrologers = useMemo(() => {
    return astrologers.filter(astro => {
      const matchesSearch =
        astro.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astro.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpec =
        specializationFilter === 'All' ||
        astro.specialization === specializationFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'active' && astro.isActive) ||
        (statusFilter === 'inactive' && !astro.isActive);

      return matchesSearch && matchesSpec && matchesStatus;
    });
  }, [astrologers, searchTerm, specializationFilter, statusFilter]);

  const uniqueSpecializations = ['All', ...new Set(astrologers.map(a => a.specialization).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('All');
    setStatusFilter('All');
  };

  // --- Edit Handlers ---
  const handleEditClick = (astro) => {
    setEditingAstro(astro);
    setFormData({ ...astro });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // NEW: handleUpdate implementation
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Replace with your actual update service/API call
      // Example: await astrologerService.update(editingAstro._id, formData);
      await axios.patch(`http://localhost:3000/api/astrologer/update/${editingAstro._id}`, formData, { withCredentials: true });
      
      toast.success('Profile updated successfully!');
      setEditingAstro(null);
      fetchAstrologers(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    // Custom toast confirmation instead of browser window.confirm for better UI
    if (window.confirm("Are you sure you want to remove this star guide? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:3000/api/astrologer/delete/${id}`, { withCredentials: true });
        toast.success('Astrologer removed from platform');
        setAstrologers(prev => prev.filter(astro => astro._id !== id));
      } catch (error) {
        toast.error('Failed to delete astrologer');
      }
    }
  };

  if (loading) return (
    <div className="p-12 text-center">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-500 dark:text-slate-400">Loading directory...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* --- FILTER BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-5 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-3 relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
          >
            {uniqueSpecializations.map(spec => (
              <option key={spec} value={spec}>{spec === 'All' ? 'All Skills' : spec}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={clearFilters}
            className="w-full h-full flex items-center justify-center p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-200"
            title="Reset Filters"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Profile</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name & Email</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Specialization</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Experience</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAstrologers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={24} className="opacity-50" />
                      <p>No astrologers found matching your filters.</p>
                      <button onClick={clearFilters} className="text-amber-500 font-bold hover:underline text-sm">Clear Filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAstrologers.map((astro) => (
                  <tr key={astro._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {astro.profileImage ? (
                          <img src={astro.profileImage} alt={astro.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-amber-600 dark:text-amber-500 text-xs">{astro.name?.charAt(0)}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {astro.name}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{astro.email}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        {astro.specialization}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {astro.experienceYears} Years
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ₹{astro.price}<span className="text-xs font-normal text-slate-500">/min</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${astro.isActive
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${astro.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                        {astro.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(astro)}
                          className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title="Edit Details"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(astro._id)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Guide"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingAstro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 size={18} className="text-amber-500" />
                Edit Astrologer Profile
              </h3>
              <button onClick={() => setEditingAstro(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specialization</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience (Yrs)</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="number" name="experienceYears" value={formData.experienceYears || ''} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price per min (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="number" name="price" value={formData.price || ''} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Status</label>
                  <select
                    name="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingAstro(null)} className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isUpdating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologerList;
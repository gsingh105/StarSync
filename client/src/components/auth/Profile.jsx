import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, LogOut, Mail, User, Edit2, Save, X, Camera } from 'lucide-react'
import authService from '../../services/authService' // Import your service
import toast from 'react-hot-toast'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUserState } = useAuth() 

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', profileImage: '' })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || ''
      })
    }
  }, [user])

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email) return toast.error("All fields are required");
    
    setLoading(true)
    try {
      // Use the service we updated in step 1
      const response = await authService.updateProfile(formData);

      if (response.success) {
        updateUserState(response.data); 
        setIsEditing(false);
        toast.success('Profile updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
         <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
            <ArrowLeft className="h-5 w-5" /> <span>Back</span>
          </Link>
          <button onClick={logout} className="text-red-500 font-bold flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          
          <div className="h-32 bg-gradient-to-r from-amber-400 to-amber-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-3xl font-bold text-slate-400">{getInitials(formData.fullName)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8 space-y-8">
            <header>
                <h2 className="text-3xl font-bold">{user?.fullName || 'User'}</h2>
                <p className="text-slate-500">{user?.email}</p>
            </header>

            <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    {isEditing ? (
                        <input 
                            className="w-full bg-transparent border-b border-amber-500 outline-none font-semibold mt-1"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    ) : <p className="font-semibold mt-1">{user?.fullName || 'N/A'}</p>}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    {isEditing ? (
                        <input 
                            className="w-full bg-transparent border-b border-amber-500 outline-none font-semibold mt-1"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    ) : <p className="font-semibold mt-1">{user?.email || 'N/A'}</p>}
                </div>
            </div>

            <footer className="flex gap-4">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} disabled={loading} className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 py-3 rounded-xl font-bold">Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                )}
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
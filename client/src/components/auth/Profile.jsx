import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, LogOut, Mail, User, Calendar, Shield, Edit2 } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get Initials Helper
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Cosmic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
         <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-bold"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex justify-center">
        <div className="w-full max-w-2xl">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Header / Banner Area */}
            <div className="h-32 bg-gradient-to-r from-amber-400 to-amber-600 relative">
               <div className="absolute -bottom-12 left-8">
                 <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-md">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">
                        {getInitials(user?.fullName || user?.name)}
                      </span>
                    )}
                 </div>
               </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 pb-8 px-8">
              
              {/* Name & Role */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user?.fullName || user?.name || 'StarSync User'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800">
                  {user?.role || 'Seeker'}
                </span>
              </div>

              {/* Info Grid */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Account Details
                </h3>

                <div className="grid gap-6">
                  {/* Full Name */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                       <User className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Full Name</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{user?.fullName || user?.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                       <Mail className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Email Address</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* User ID */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                       <Shield className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">User ID</p>
                      <p className="text-sm font-mono font-medium text-slate-600 dark:text-slate-300">{user?._id || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Date Joined */}
                  {user?.createdAt && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                         <Calendar className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Member Since</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10">
                <button className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
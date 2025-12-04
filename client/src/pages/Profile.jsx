import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, LogOut, Mail, User, Calendar } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="bg-gray-800/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-200 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Card */}
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-8">
          
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-amber-400">
                {user?.fullName || 'User'}
              </h2>
              <p className="text-gray-300">{user?.email || 'No email'}</p>

              <span className="inline-block mt-2 px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">
              Account Information
            </h3>

            <div className="space-y-5">
              <div className="flex gap-3 text-gray-300">
                <User className="h-5 w-5 text-amber-400" />
                <div>
                  <label className="text-sm opacity-70">Full Name</label>
                  <p className="text-lg font-medium">{user?.fullName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-3 text-gray-300">
                <Mail className="h-5 w-5 text-amber-400" />
                <div>
                  <label className="text-sm opacity-70">Email Address</label>
                  <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-3 text-gray-300">
                <User className="h-5 w-5 text-amber-400" />
                <div>
                  <label className="text-sm opacity-70">User ID</label>
                  <p className="text-gray-400 font-mono text-xs">{user?._id || 'N/A'}</p>
                </div>
              </div>

              {user?.createdAt && (
                <div className="flex gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  <div>
                    <label className="text-sm opacity-70">Member Since</label>
                    <p className="text-lg font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button className="w-full bg-amber-500 text-gray-900 py-3 rounded-xl font-semibold hover:bg-amber-400 transition-all">
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

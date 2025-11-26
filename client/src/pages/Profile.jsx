import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { ArrowLeft, LogOut, Mail, User, Calendar } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{user?.fullName || 'User'}</h2>
                <p className="text-gray-600">{user?.email || 'No email'}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {user?.role?.toUpperCase() || 'USER'}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{user?.fullName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Email Address</label>
                    <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">User ID</label>
                    <p className="text-gray-800 font-mono text-sm">{user?._id || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="text-gray-800 font-medium capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>

                {user?.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Member Since</label>
                      <p className="text-gray-800 font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
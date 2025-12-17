// src/pages/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AddAstrologerForm from '../components/admin/AddAstrologerForm';

const AdminDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
           <span className="text-xl font-bold tracking-tight text-gray-900">AdminPanel</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600">
            Welcome, {user?.name || "Admin"}
          </span>
          <button 
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Use the form component here */}
        <AddAstrologerForm />
        
      </main>
    </div>
  );
};

export default AdminDashboard;
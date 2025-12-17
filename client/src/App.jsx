import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth here
import { AstrologerAuthProvider } from './context/AstrologerAuthContext';

// User Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Astrologer Components
import AstrologerLogin from './pages/AstrologerLogin';
import AstrologerDashboard from './pages/AstrologerDashboard';
import NotFound from './pages/NotFound';

// Admin Components
import AdminDashboard from './pages/AdminDashboard'; // Ensure this path matches where you saved the dashboard

// --- INLINE WRAPPERS & ROUTE GUARDS ---

// 1. Astrologer Context Wrapper
const AstrologerLayout = () => {
  return (
    <AstrologerAuthProvider>
      <Outlet />
    </AstrologerAuthProvider>
  );
};

// 2. Admin Route Guard (Defined directly here as requested)
const AdminRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Simple loading state
  }

  // Check if user is logged in AND is an admin
  // Make sure your backend User model actually sends 'role'
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// --- MAIN APP COMPONENT ---

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC USER ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* --- ADMIN ROUTES --- */}
          {/* We wrap admin routes in the AdminRoute guard we created above */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* --- ASTROLOGER ROUTES --- */}
          <Route element={<AstrologerLayout />}>
            <Route path="/astrologer/login" element={<AstrologerLogin />} />
            <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />
          </Route>

          {/* --- PROTECTED USER ROUTES --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path='*' element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
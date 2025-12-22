import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { AstrologerAuthProvider } from './context/AstrologerAuthContext';

// Components
import Navbar from './components/common/Navbar'; // Import Navbar
import Footer from './components/common/Footer'; // Import Footer

// User Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './components/auth/Profile';
import Home from './pages/Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Astrologer Pages
import AstrologerLogin from './components/astrologer/AstrologerLogin';
import AstrologerDashboard from './pages/astrologer/AstrologerDashboard';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import KundliPage from './pages/KundliPage';
import DailyHoroscope from './pages/DailyHoroscope';
import MatchingPage from './pages/MatchingPage';


const MainLayout = () => {
  return (
    // Remove bg-black here so it follows the body background
    <div className="flex flex-col min-h-screen bg-transparent">
      <Navbar />
      <main className="grow "> {/* Removed bg-black */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AstrologerLayout = () => {
  return (
    <AstrologerAuthProvider>
      <Outlet />
    </AstrologerAuthProvider>
  );
};

const AdminRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" replace />;
  return <Outlet />;
};

// --- APP ---

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/astrologers" element={<Dashboard />} />

  {/* Wrap nested routes - removed the 'isAuthenticated' prop since the component uses useAuth() */}
  <Route element={<ProtectedRoute />}>
    <Route path="/kundli" element={<KundliPage />} />
    <Route path="/horoscope" element={<DailyHoroscope />} />
    <Route path="/compatibility" element={<MatchingPage />} />
  </Route>
  
  <Route path='*' element={<NotFound />} />
</Route>



          <Route element={<AstrologerLayout />}>
            <Route path="/astrologer/login" element={<AstrologerLogin />} />
            <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
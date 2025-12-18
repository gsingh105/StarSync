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


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20"> {/* Padding for fixed navbar */}
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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />


            <Route path='*' element={<NotFound />} />
            <Route path='/kundli' element={<KundliPage/>}/>
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
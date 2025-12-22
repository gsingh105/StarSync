import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AstrologerAuthProvider } from './context/AstrologerAuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./components/auth/Profile'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));


const KundliPage = lazy(() => import('./pages/KundliPage'));
const DailyHoroscope = lazy(() => import('./pages/DailyHoroscope'));
const MatchingPage = lazy(() => import('./pages/MatchingPage'));


const AstrologerLogin = lazy(() => import('./components/astrologer/AstrologerLogin'));
const AstrologerDashboard = lazy(() => import('./pages/astrologer/AstrologerDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Navbar />
      <main className="grow">
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


const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-transparent">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);



function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        {/* Suspense handles the loading state while the lazy components are being fetched */}
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/astrologers" element={<Dashboard />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/kundli" element={<KundliPage />} />
                <Route path="/horoscope" element={<DailyHoroscope />} />
                <Route path="/compatibility" element={<MatchingPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path='*' element={<NotFound />} />
            </Route>

            {/* Astrologer Routes */}
            <Route element={<AstrologerLayout />}>
              <Route path="/astrologer/login" element={<AstrologerLogin />} />
              <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
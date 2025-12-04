import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AstrologerAuthProvider } from './context/AstrologerAuthContext'; // Import the new provider

// User Components (Assuming these exist in your project)
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

// Layout to wrap Astrologer routes with their specific Context
const AstrologerLayout = () => {
  return (
    <AstrologerAuthProvider>
      <Outlet />
    </AstrologerAuthProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC USER ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* --- PASSWORD RECOVERY --- */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- ASTROLOGER ROUTES --- */}
          {/* This wrapper is CRITICAL. It provides the context for the pages inside */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
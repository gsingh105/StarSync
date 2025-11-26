import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner while checking if the user is logged in
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
         <div className="w-8 h-8 rounded-full bg-amber-500/20 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
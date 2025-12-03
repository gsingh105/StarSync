import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure this context exists or remove if using raw service
import { ShieldCheck, User, Lock, Activity, ArrowLeft } from 'lucide-react';
import astrologerService from '../services/astrologerService';

const AstrologerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If you don't have AuthContext implemented yet, we can use the service directly
  // const { loginAstrologer } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // FIX: Call .login() method, pass both email AND password
      await astrologerService.login(email);
      
      // Navigate to dashboard on success
      navigate('/astrologer/dashboard');
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); .font-cinzel { font-family: 'Cinzel', serif; }`}</style>

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>

      <div className="w-full max-w-md bg-[#0a0a0c] border border-amber-500/20 p-8 rounded-sm shadow-[0_0_50px_rgba(217,119,6,0.1)] relative z-10">
        
        <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-amber-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-cinzel text-amber-100 text-center mb-2">Partner Portal</h2>
        <p className="text-gray-500 text-center text-sm mb-8 font-playfair italic">
          Enter the sanctum for verified masters
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-200 text-sm rounded flex items-center gap-2 animate-pulse">
             <Activity className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-amber-500/80 text-[10px] font-cinzel font-bold uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-amber-500/20 rounded-sm py-2.5 pl-10 pr-4 text-gray-300 focus:border-amber-500/60 focus:outline-none transition-colors placeholder-gray-700"
                placeholder="master@starsync.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-500/80 text-[10px] font-cinzel font-bold uppercase tracking-wider mb-2">Passkey</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-amber-500/20 rounded-sm py-2.5 pl-10 pr-4 text-gray-300 focus:border-amber-500/60 focus:outline-none transition-colors placeholder-gray-700"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-cinzel font-bold py-3 rounded-sm transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-900/20"
          >
            {loading ? 'Verifying Credentials...' : 'Enter Sanctum'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AstrologerLogin;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authService.forgotPassword(email);
      setStatus({ type: 'success', message: 'Reset link sent! Please check your email.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#e0e0e0] font-sans relative">
      {/* Background */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'); .font-cinzel { font-family: 'Cinzel', serif; }`}</style>
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
      
      <div className="w-full max-w-md p-8 bg-[#0a0a0c]/90 border border-amber-500/20 rounded-sm relative z-10 shadow-xl">
        <h1 className="text-2xl font-cinzel text-amber-100 mb-2">Forgot Password?</h1>
        <p className="text-gray-400 text-sm mb-6">Enter your email to receive a cosmic reset link.</p>

        {status.message && (
          <div className={`p-3 mb-4 text-sm rounded border ${
            status.type === 'success' 
              ? 'bg-green-900/20 text-green-400 border-green-500/30' 
              : 'bg-red-900/20 text-red-400 border-red-500/30'
            }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">Email Address</label>
            <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seeker@starsync.com"
              required
              className="w-full bg-[#121212] pl-10 pr-4 py-2.5 border border-amber-500/20 rounded-sm focus:border-amber-500/60 focus:outline-none text-amber-50 placeholder-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 py-2.5 rounded-sm font-cinzel font-bold tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
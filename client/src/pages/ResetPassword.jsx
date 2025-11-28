import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    
    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, password);
      // Optional: Add a success toast here or redirect immediately
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#e0e0e0] relative">
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>

      <div className="w-full max-w-md p-8 bg-[#0a0a0c]/90 border border-amber-500/20 rounded-sm relative z-10 shadow-xl">
        <h1 className="text-2xl font-cinzel text-amber-100 mb-6 text-center">Set New Password</h1>

        {error && (
            <div className="p-3 mb-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4"/> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">New Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] pl-10 pr-4 py-2.5 border border-amber-500/20 rounded-sm focus:border-amber-500/60 focus:outline-none placeholder-gray-700"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">Confirm Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#121212] pl-10 pr-4 py-2.5 border border-amber-500/20 rounded-sm focus:border-amber-500/60 focus:outline-none placeholder-gray-700"
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 py-2.5 rounded-sm font-cinzel font-bold tracking-widest transition-all"
          >
            {loading ? 'Resetting...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
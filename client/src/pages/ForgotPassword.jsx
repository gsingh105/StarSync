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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center px-4">

      {/* Soft Golden Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200 p-10 relative overflow-hidden">

          {/* Subtle Header Glow */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-100/30 to-transparent pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
            <p className="text-amber-700 text-lg">Enter your email to receive a reset link</p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`mb-6 p-4 rounded-2xl border text-center font-medium transition-all ${
              status.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              {status.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@starsync.com"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-amber-50/70 border border-amber-300 rounded-2xl text-gray-800 placeholder-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-amber-700 mt-8 text-sm">
          The stars will guide you back
        </p>
      </div>
    </div>
  );
}
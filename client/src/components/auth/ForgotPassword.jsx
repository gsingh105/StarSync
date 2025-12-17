import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';

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
      setStatus({ type: 'success', message: 'Reset link sent! Please check your email inbox.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 relative overflow-hidden transition-colors duration-500 font-sans">

      {/* Cosmic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 relative overflow-hidden">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-4 text-amber-600 dark:text-amber-400">
              <Sparkles size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm font-medium transition-all ${
              status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="mt-0.5">{status.message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 dark:text-slate-500 mt-8 text-sm">
          The stars will guide you back
        </p>
      </div>
    </div>
  );
}
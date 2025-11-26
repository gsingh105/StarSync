import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';

// --- Classic Assets / Icons ---
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// Validation Schema
const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(30, 'Name must be less than 30 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');

    try {
      const payload = {
        fullName: data.fullName, 
        email: data.email,
        password: data.password
      };

      await authService.register(payload);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration Error:', error);
      let errorMessage = 'Registration failed.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setApiError(String(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // In a real app, this would redirect to OAuth endpoint
    console.log("Google Auth Triggered");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#e0e0e0] font-sans relative overflow-hidden selection:bg-amber-900 selection:text-amber-100 p-4">
      
      {/* --- Fonts & Styles --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px #121212 inset !important;
            -webkit-text-fill-color: #e0e0e0 !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* --- Ambient Effects --- */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- Card Container --- */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Decorative Top Border */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-1 opacity-50"></div>

        <div className="bg-[#0a0a0c]/90 backdrop-blur-xl border border-amber-500/20 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 group">
                 <StarIcon className="w-8 h-8 text-amber-500 mx-auto group-hover:rotate-180 transition-transform duration-700" />
            </Link>
            <h1 className="text-3xl font-cinzel font-bold text-amber-100 mb-2">
              Begin Your Journey
            </h1>
            <p className="font-playfair italic text-gray-400 text-sm">
              Create an account to unlock cosmic wisdom
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name field */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register('fullName')}
                  className={`w-full bg-[#121212] pl-10 pr-4 py-2.5 border rounded-sm font-playfair focus:outline-none focus:ring-1 transition-all text-amber-50 placeholder-gray-700 ${
                    errors.fullName 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-amber-500/20 focus:border-amber-500/60 focus:ring-amber-500/30 hover:border-amber-500/40'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs font-serif text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="seeker@starsync.com"
                  {...register('email')}
                  className={`w-full bg-[#121212] pl-10 pr-4 py-2.5 border rounded-sm font-playfair focus:outline-none focus:ring-1 transition-all text-amber-50 placeholder-gray-700 ${
                    errors.email 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-amber-500/20 focus:border-amber-500/60 focus:ring-amber-500/30 hover:border-amber-500/40'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-serif text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full bg-[#121212] pl-10 pr-12 py-2.5 border rounded-sm font-playfair focus:outline-none focus:ring-1 transition-all text-amber-50 placeholder-gray-700 ${
                    errors.password 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-amber-500/20 focus:border-amber-500/60 focus:ring-amber-500/30 hover:border-amber-500/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-serif text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-cinzel font-semibold tracking-widest text-amber-500/80 mb-2 uppercase">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full bg-[#121212] pl-10 pr-4 py-2.5 border rounded-sm font-playfair focus:outline-none focus:ring-1 transition-all text-amber-50 placeholder-gray-700 ${
                    errors.confirmPassword 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-amber-500/20 focus:border-amber-500/60 focus:ring-amber-500/30 hover:border-amber-500/40'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-serif text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="p-3 bg-red-900/10 border border-red-900/30 rounded-sm">
                <p className="text-sm font-serif text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {apiError}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 py-3 rounded-sm font-cinzel font-bold tracking-widest border border-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-900/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-amber-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Aligning Stars...
                </span>
              ) : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs font-cinzel tracking-widest">
                <span className="px-4 bg-[#0a0a0c] text-gray-500 uppercase">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-700 hover:border-amber-500/50 rounded-sm font-playfair text-gray-300 bg-[#15151a] hover:bg-[#1a1a20] focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Sign in link */}
            <div className="text-center text-sm pt-2 font-serif">
              <span className="text-gray-500">Already initiated? </span>
              <Link
                to="/login"
                className="text-amber-500 hover:text-amber-300 font-semibold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
        
        {/* Decorative Bottom Border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1 opacity-50"></div>
      </div>
    </div>
  );
}
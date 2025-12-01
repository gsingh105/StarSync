import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google'; 

// --- Assets ---
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const registerSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export default function Register() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth(); // Import Google Login from Context (Register uses same flow as login for Google)
  
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

  // Standard Register
  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    // ... (Note: Standard register logic calls authService.register directly usually, 
    // or you can add a register method to AuthContext. For now assume direct service or context)
    // To match your previous structure, we import authService or handle it here.
    // Let's assume we import authService at top or better yet, assume AuthContext has a register method?
    // Based on previous files, AuthContext only had Login. Let's stick to importing authService for standard register.
    // But since I didn't import authService at the top of this file block, I will assume you import it.
    // **WAIT**: I need to add import authService.
    
    // Actually, to be consistent with Login, let's just use authService here.
    try {
      const authServiceModule = await import('../../services/authService'); // Dynamic import or add to top
      await authServiceModule.default.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      });
      navigate('/login'); // Redirect to login after successful register
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Hook
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        await googleLogin(tokenResponse.access_token);
        navigate('/dashboard');
      } catch (error) {
        console.error("Google Error:", error);
        setApiError("Google Sign-in failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setApiError("Google Sign-in failed"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#e0e0e0] font-sans relative overflow-hidden selection:bg-amber-900 selection:text-amber-100 p-4">
      {/* Styles & BG (Same as Login) */}
      <style>{`
        @import url('[https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap](https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap)');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-1 opacity-50"></div>
        <div className="bg-[#0a0a0c]/90 backdrop-blur-xl border border-amber-500/20 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 group"><StarIcon className="w-8 h-8 text-amber-500 mx-auto group-hover:rotate-180 transition-transform duration-700" /></Link>
            <h1 className="text-3xl font-cinzel font-bold text-amber-100 mb-2">Begin Your Journey</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
                <label className="block text-xs font-cinzel font-semibold text-amber-500/80 mb-2 uppercase">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400" />
                    <input type="text" placeholder="John Doe" {...register('fullName')} className={`w-full bg-[#121212] pl-10 p-2.5 border rounded-sm focus:outline-none focus:ring-1 text-amber-50 placeholder-gray-700 ${errors.fullName ? 'border-red-500/50' : 'border-amber-500/20'}`} />
                </div>
                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs font-cinzel font-semibold text-amber-500/80 mb-2 uppercase">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400" />
                    <input type="email" placeholder="seeker@starsync.com" {...register('email')} className={`w-full bg-[#121212] pl-10 p-2.5 border rounded-sm focus:outline-none focus:ring-1 text-amber-50 placeholder-gray-700 ${errors.email ? 'border-red-500/50' : 'border-amber-500/20'}`} />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs font-cinzel font-semibold text-amber-500/80 mb-2 uppercase">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} className={`w-full bg-[#121212] pl-10 p-2.5 border rounded-sm focus:outline-none focus:ring-1 text-amber-50 placeholder-gray-700 ${errors.password ? 'border-red-500/50' : 'border-amber-500/20'}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-amber-400">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-xs font-cinzel font-semibold text-amber-500/80 mb-2 uppercase">Confirm Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-amber-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('confirmPassword')} className={`w-full bg-[#121212] pl-10 p-2.5 border rounded-sm focus:outline-none focus:ring-1 text-amber-50 placeholder-gray-700 ${errors.confirmPassword ? 'border-red-500/50' : 'border-amber-500/20'}`} />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {apiError && <div className="p-3 bg-red-900/10 border border-red-900/30 rounded-sm"><p className="text-sm text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{apiError}</p></div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 py-3 rounded-sm font-cinzel font-bold tracking-widest border border-amber-500/20 transition-all shadow-lg hover:shadow-amber-900/20">{loading ? 'Creating...' : 'Create Account'}</button>

            {/* Google */}
            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div><div className="relative flex justify-center text-xs font-cinzel tracking-widest"><span className="px-4 bg-[#0a0a0c] text-gray-500 uppercase">Or continue with</span></div></div>
            
            <button type="button" onClick={() => handleGoogleAuth()} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-700 hover:border-amber-500/50 rounded-sm font-playfair text-gray-300 bg-[#15151a] hover:bg-[#1a1a20] transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
            </button>

            <div className="text-center text-sm pt-2 font-serif"><span className="text-gray-500">Already initiated? </span><Link to="/login" className="text-amber-500 hover:text-amber-300 font-semibold hover:underline">Sign In</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
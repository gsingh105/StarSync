import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const registerSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export default function Register() {
  const navigate = useNavigate()
  const { googleLogin } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setApiError('')
    try {
      const authServiceModule = await import('../../services/authService')
      await authServiceModule.default.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      })
      navigate('/login')
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
        await googleLogin(tokenResponse.access_token)
        navigate('/dashboard')
      } catch (error) {
        setApiError('Google Sign-in failed.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => setApiError('Google Sign-in failed')
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb] text-gray-900 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="John Doe"
                {...register('fullName')}
                className={`w-full pl-10 p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-slate-500 focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="email" placeholder="you@example.com"
                {...register('email')}
                className={`w-full pl-10 p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-slate-500 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                {...register('password')}
                className={`w-full pl-10 p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-slate-500 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full pl-10 p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-slate-500 focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {apiError &&
            <div className="p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {apiError}
              </p>
            </div>
          }

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 rounded-md font-medium transition">
            {loading ? 'Creating...' : 'Create Account'}
          </button>


          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          <button type="button"
            onClick={() => handleGoogleAuth()}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-slate-600 font-semibold hover:underline">
              Sign In
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}

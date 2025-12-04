import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, User, Lock, Activity, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAstrologerAuth } from '../context/AstrologerAuthContext'

const AstrologerLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { login } = useAstrologerAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (password !== '123456') {
      setError('Invalid Passkey. Access Denied.')
      setIsLoading(false)
      return
    }

    try {
      await login(email)
      navigate('/astrologer/dashboard')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed. Please check your email.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border p-8 relative">
        <Link to="/" className="absolute top-4 left-4 text-gray-500 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 shadow">
            <ShieldCheck className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">Partner Portal</h2>
        <p className="text-gray-500 text-center text-sm mb-6 italic">Enter the sanctum for verified masters</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded flex items-center gap-2">
            <Activity className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Passkey */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Passkey</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your passkey"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:to-slate-600 text-white font-semibold py-3 rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Verifying...' : 'Enter Sanctum'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AstrologerLogin

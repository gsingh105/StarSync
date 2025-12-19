import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, User, Lock, Activity, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAstrologerAuth } from '../../context/AstrologerAuthContext'

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

    // Maintaining your specific passkey logic
    if (password !== '123456') {
      setError('Invalid Passkey. Access Denied.')
      setIsLoading(false)
      return
    }

    try {
      await login(email)
      navigate('/astrologer/dashboard')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#01040a] px-6 relative overflow-hidden font-sans">
      
      {/* Ambient Cosmic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Glassmorphic Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-10 md:p-12 shadow-2xl relative overflow-hidden">
          
          <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-amber-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20 mb-6 group">
              <ShieldCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-3xl font-black text-white text-center tracking-tighter uppercase mb-2">Partner <span className="text-amber-500">Portal</span></h2>
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
               <Sparkles size={12} className="text-amber-500" /> Sanctum for Verified Masters
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider animate-shake">
              <Activity className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="master@starsync.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Passkey */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-amber-500/10 hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                'Enter Sanctum'
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="mt-10 text-center">
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AstrologerLogin
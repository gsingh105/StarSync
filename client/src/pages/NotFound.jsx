import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#01040a] flex items-center justify-center px-6 relative overflow-hidden py-30">
      
      {/* Ambient Cosmic Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rounded-[3rem] p-10 md:p-16 text-center max-w-xl w-full animate-in fade-in zoom-in duration-700">
        
        {/* Animated Compass Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl mb-8 shadow-2xl shadow-amber-500/20 rotate-12">
           <Compass className="w-12 h-12 text-white animate-[spin_10s_linear_infinite]" />
           <Sparkles className="absolute -top-2 -right-2 text-amber-300 animate-pulse" size={24} />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Lost in the <span className="text-amber-500">Cosmos?</span>
        </h2>
        
        <p className="text-slate-400 mb-12 leading-relaxed font-medium text-lg">
          The page you are looking for has drifted into a black hole or doesn't exist in this timeline.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 bg-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-3 text-white border border-white/10 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
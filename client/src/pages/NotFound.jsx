import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-10 md:p-14 text-center max-w-lg w-full backdrop-blur-sm">
        
        {/* Icon / 404 Header */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
           <Compass className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 mb-2">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Lost in the Cosmos?
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          The page you are looking for has drifted into a black hole or doesn't exist in this timeline.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg shadow-slate-900/10"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Link>

          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}
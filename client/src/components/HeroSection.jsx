import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const HeroSection = () => (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    
    {/* Background Elements */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div className="relative max-w-5xl mx-auto text-center z-10">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-8 backdrop-blur-sm">
        <Sparkles className="w-4 h-4" />
        <span>Vedic Astrology • Tarot • Spiritual Guidance</span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
        Discover Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-200">
          Cosmic Blueprint
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
        Unlock the secrets of your destiny. Connect with certified astrologers for clarity on love, career, and life purpose with ancient precision.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          to="/register" 
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300"
        >
          Get Free Reading
        </Link>
        <Link 
          to="/astrologers" 
          className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-white font-bold rounded-full border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
        >
          Meet Our Experts
        </Link>
      </div>
      
      {/* Social Proof / Stats could go here */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-8 text-slate-500 dark:text-slate-500 text-sm font-medium uppercase tracking-widest">
        <span>50k+ Readings</span>
        <span>•</span>
        <span>4.9/5 Rating</span>
        <span>•</span>
        <span>100% Private</span>
      </div>
    </div>
  </section>
)

export default HeroSection
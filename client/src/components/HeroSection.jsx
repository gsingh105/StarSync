import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const HeroSection = () => (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
    </div>

    <div className="relative max-w-5xl mx-auto text-center z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300 text-sm font-bold mb-8 backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="uppercase tracking-wider">Vedic Astrology • Tarot</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
        Discover Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
          Cosmic Blueprint
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
        Unlock the secrets of your destiny with ancient precision and modern clarity.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/register" className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95">
          Get Free Reading
        </Link>
        <Link to="/astrologers" className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl border border-white/10 hover:border-amber-500 transition-all">
          Meet Our Experts
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection
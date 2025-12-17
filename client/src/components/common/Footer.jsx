import React, { useState } from 'react'
import MapSection from '../MapSection' // Assuming you have this file
import { Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [showMapModal, setShowMapModal] = useState(false)

  return (
    <footer className="relative bg-slate-950 text-slate-300 py-20 px-6 overflow-hidden border-t border-slate-900">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-white tracking-wide">
              Star<span className="text-amber-500">Sync</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your digital gateway to ancient wisdom. Verified astrologers, secure readings, and cosmic clarity.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'Horoscopes', 'Tarot Reading', 'Kundli Matching'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location / Map */}
          <div>
            <h3 className="text-white font-semibold mb-6">Visit Us</h3>
            <div 
              onClick={() => setShowMapModal(true)}
              className="w-full h-32 rounded-xl overflow-hidden relative cursor-pointer group border border-slate-800 hover:border-amber-500/50 transition-all"
            >
              {/* Placeholder for map preview if MapSection is heavy, otherwise render MapSection */}
              <MapSection style={{ height: '100%', width: '100%' }} small />
              <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/30 transition-all flex items-center justify-center">
                 <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">View Map</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              <p>Phase 7, Mohali, Punjab, India</p>
              <p className="text-amber-500 mt-1">+91 98765 43210</p>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} StarSync. All rights reserved.</p>
        </div>
      </div>

       {/* Map Modal */}
       {showMapModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowMapModal(false)}
        >
          <div className="relative w-full max-w-4xl h-[70vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 z-[999] bg-white text-black p-2 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <MapSection style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
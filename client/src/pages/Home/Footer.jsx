import React, { useState } from 'react'
import MapSection from './MapSection'
import { Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const StarIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const Footer = () => {
  const [showMapModal, setShowMapModal] = useState(false)

  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900 to-black text-gray-300 py-20 px-6 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand / About
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <StarIcon className="w-10 h-10 text-amber-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                StarSync
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              StarSync connects you with certified Vedic astrologers and tarot readers for profound clarity in life, love, and destiny.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/50 transition-all group cursor-pointer"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-amber-400 font-bold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Get Reading', 'Astrologers', 'Contact', 'About Us'].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-amber-300 transition duration-300 block text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h3 className="text-amber-400 font-bold text-lg">Our Services</h3>
            <ul className="space-y-3">
              {['Live Consultation', 'Personal Horoscope', 'Relationship Analysis', 'Tarot Reading'].map((service, i) => (
                <li key={i}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-amber-300 transition duration-300 block text-sm font-medium"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-amber-400 font-bold text-lg">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">Phase 7, Mohali<br />Punjab, India</p>
              <p className="text-gray-400">support@starsync.in</p>
              <p className="text-amber-300 font-medium">+91 98765 43210</p>
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-5">
            <h3 className="text-amber-400 font-bold text-lg">Our Location</h3>
            <div
              onClick={() => setShowMapModal(true)}
              className="relative w-full h-48 rounded-2xl overflow-hidden border border-amber-900/50 shadow-2xl cursor-pointer group hover:border-amber-500/60 transition-all duration-500"
            >
              <MapSection style={{ height: '100%', width: '100%' }} small />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 left-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view full map
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-amber-400 font-medium">StarSync</span>. All rights reserved.
            <span className="text-gray-600"> • Guided by Ancient Wisdom • Powered by Divine Care</span>
          </p>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      {showMapModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[80vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500 transition"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
            <MapSection style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
import React from 'react'
import { Link } from 'react-router-dom'

const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const HeroSection = () => (
  <section className="py-20 px-6 text-center bg-gradient-to-b from-white to-gray-50">
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <StarIcon className="w-4 h-4" />
        Vedic Astrology • Tarot • Spiritual Guidance
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
        Discover Your<br />
        <span className="text-amber-600">Cosmic Path</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
        Connect with certified astrologers for clarity on love, career, and life purpose.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register" className="px-8 py-4 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition shadow-md">
          Get Your Reading
        </Link>
        <Link to="/astrologers" className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 transition">
          Meet Our Experts
        </Link>
      </div>
    </div>
  </section>
)

export default HeroSection

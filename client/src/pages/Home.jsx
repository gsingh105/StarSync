import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for key features
const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    ),
    title: "Live Astrologer Consultation",
    description: "Connect instantly via chat or call with certified Vedic and Tarot experts, available 24/7.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    ),
    title: "Daily Personalized Horoscopes",
    description: "Unlock predictions based on your full birth chart for career, love, and finance.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
    ),
    title: "Relationship Compatibility",
    description: "Analyze synastry reports to understand your true cosmic connection with partners.",
  },
];

const testimonial = {
  quote: "StarSync brought clarity and direction to my life. The detailed chart analysis was incredibly accurate. Highly recommend!",
  name: "Anya S.",
  role: "Verified User, Mumbai",
  stars: 5
};

const Home = () => {
  // Helper function to render star icons
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < count ? 'text-yellow-400' : 'text-gray-600'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.63-.921 1.932 0l1.936 5.952h6.26c.969 0 1.371 1.24.588 1.81l-5.07 3.684 1.937 5.952c.3.921-.755 1.688-1.542 1.115L10 16.592l-5.07 3.684c-.787.573-1.842-.194-1.542-1.115l1.937-5.952-5.07-3.684c-.783-.57-.381-1.81.588-1.81h6.26l1.936-5.952z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-indigo-400">
                StarSync
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#services" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
              >
                Services
              </a>
              <a 
                href="#why-us" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
              >
                Why Us
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
              >
                Reviews
              </a>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-sm font-medium rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 text-sm font-bold rounded-full bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/30"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 animate-pulse">
                  Your Destiny, Decoded.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Connect instantly with verified astrologers. Gain clarity on love, career, and life's biggest questions—powered by the stars.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-all duration-200 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 hover:scale-105"
                >
                  Consult an Astrologer Now
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full border-2 border-indigo-400 text-indigo-200 hover:bg-indigo-800/50 transition-all duration-200 hover:scale-105"
                >
                  Daily Horoscope
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-20 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Cosmic Services</h2>
              <p className="text-indigo-300 text-lg md:text-xl">Guiding your journey with ancient wisdom and modern connection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="why-us" className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Why Choose StarSync?</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              <div className="p-6 rounded-xl bg-gray-800/50 shadow-inner border border-gray-700">
                <p className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">100K+</p>
                <p className="text-gray-400 text-sm md:text-base">Satisfied Readings</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 shadow-inner border border-gray-700">
                <p className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">500+</p>
                <p className="text-gray-400 text-sm md:text-base">Verified Astrologers</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 shadow-inner border border-gray-700">
                <p className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">24/7</p>
                <p className="text-gray-400 text-sm md:text-base">Instant Availability</p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 shadow-inner border border-gray-700">
                <p className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">Private</p>
                <p className="text-gray-400 text-sm md:text-base">100% Confidential</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-xl shadow-indigo-600/50 hover:shadow-indigo-600/70 hover:scale-105"
              >
                Meet Our Experts
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="testimonials" className="py-20 bg-gray-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">What Our Stars Say</h2>
            </div>

            <div className="bg-gray-700/70 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-600">
              <div className="flex justify-center mb-6">
                {renderStars(testimonial.stars)}
              </div>
              <blockquote className="text-xl md:text-2xl italic text-gray-200 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-center">
                <p className="text-yellow-400 font-semibold text-lg">{testimonial.name}</p>
                <p className="text-gray-400 text-sm mt-1">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} StarSync. All rights reserved. | Terms & Privacy | Contact Us</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
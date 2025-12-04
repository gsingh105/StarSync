import React from 'react'
import { FiMessageSquare, FiStar, FiHeart } from 'react-icons/fi'

const features = [
  {
    title: "Live Consultation",
    description: "Connect instantly with experienced Vedic astrologers and Tarot readers for real-time guidance.",
    icon: <FiMessageSquare className="text-5xl text-amber-400" />,
  },
  {
    title: "Personal Horoscope",
    description: "Receive precise Vedic birth charts with detailed, personalized life predictions.",
    icon: <FiStar className="text-5xl text-amber-amber-400" />,
  },
  {
    title: "Relationship Analysis",
    description: "Unlock deep compatibility insights for love, marriage, and meaningful partnerships.",
    icon: <FiHeart className="text-5xl text-amber-400" />,
  },
]

const FeaturesSection = () => (
  <section id="services" className="py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 overflow-hidden">
    <div className="max-w-7xl mx-auto text-center relative">
      {/* Subtle glowing background accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300 mb-6">
          What We Offer
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-16 max-w-3xl mx-auto">
          Personalized guidance rooted in ancient wisdom, delivered with modern precision
        </p>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-b from-gray-900/50 to-gray-800/80 backdrop-blur-sm border border-amber-900/30 rounded-3xl p-10 overflow-hidden transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:-translate-y-4"
            >
              {/* Glowing hover orb effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
              </div>

              {/* Icon with glow */}
              <div className="relative mb-8 inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">{feature.icon}</div>
              </div>

              <h3 className="text-3xl font-bold text-amber-100 mb-4 group-hover:text-amber-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {feature.description}
              </p>

              {/* Subtle bottom accent line */}
              <div className="mt-8 h-1 w-16 bg-gradient-to-r from-amber-400 to-transparent rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default FeaturesSection
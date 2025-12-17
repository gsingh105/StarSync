import React from 'react'
import { MessageSquare, Star, Heart } from 'lucide-react'

const features = [
  {
    title: "Live Consultation",
    description: "Connect instantly with experienced Vedic astrologers and Tarot readers for real-time guidance.",
    icon: <MessageSquare className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Personal Horoscope",
    description: "Receive precise Vedic birth charts with detailed, personalized life predictions.",
    icon: <Star className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Relationship Analysis",
    description: "Unlock deep compatibility insights for love, marriage, and meaningful partnerships.",
    icon: <Heart className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500"
  },
]

const FeaturesSection = () => (
  <section id="services" className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-500">
    <div className="max-w-7xl mx-auto">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Divine Guidance, <span className="text-amber-500">Delivered</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
           We combine ancient wisdom with modern technology to provide you with the most accurate and accessible spiritual guidance.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            {/* Icon Container */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {feature.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default FeaturesSection
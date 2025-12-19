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
  <section className="py-24 px-6 bg-[#01040a] border-y border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Divine Guidance, <span className="text-amber-500 text-glow">Delivered</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/50 transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection
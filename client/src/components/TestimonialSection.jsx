import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "StarSync helped me understand my path clearly. The reading was accurate, kind, and truly transformative.",
    name: "Priya Malhotra",
    location: "Delhi, India",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    quote: "The astrologer guided me through a crucial career decision. The insights were specific and actionable.",
    name: "Rahul Sharma",
    location: "Mumbai, India",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "Amazing tarot reading experience! Very personal and detailed guidance regarding my relationships.",
    name: "Anita Verma",
    location: "Bengaluru, India",
    image: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    quote: "Highly recommend StarSync for anyone seeking clarity. The platform is easy to use and experts are genuine.",
    name: "Sandeep Singh",
    location: "Chandigarh, India",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
]

const TestimonialSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  }

  return (
    <section id="reviews" className="py-24 px-6 bg-slate-100 dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Trusted by Believers</h2>
           <p className="text-slate-600 dark:text-slate-400">Join thousands who have found their path.</p>
        </div>

        <Slider {...settings} className="pb-12">
          {testimonials.map((t, index) => (
            <div key={index} className="px-3">
              <div className="h-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 relative">
                <Quote className="absolute top-8 right-8 text-amber-500/20 w-12 h-12" />
                
                <div className="flex gap-1 mb-6 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>

                <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default TestimonialSection
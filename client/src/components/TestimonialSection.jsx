import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, Quote } from 'lucide-react';

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
];

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
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }]
  };

  return (
    <section id="reviews" className="py-24 px-6 bg-[#01040a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Trusted by <span className="text-amber-500">Seekers</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join thousands who have aligned their stars with our expert guidance.
          </p>
        </div>

        <Slider {...settings} className="testimonial-slider pb-12">
          {testimonials.map((t, index) => (
            <div key={index} className="px-4">
              <div className="h-full bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-amber-500/30 transition-all duration-500 relative group">
                <Quote className="absolute top-10 right-10 text-amber-500/10 w-16 h-16 group-hover:text-amber-500/20 transition-colors" />
                
                <div className="flex gap-1 mb-8 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>

                <blockquote className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all"
                  />
                  <div>
                    <p className="font-bold text-white text-lg">{t.name}</p>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Add this CSS to your global style or a styled-component to fix dots color */}
      <style>{`
        .testimonial-slider .slick-dots li button:before { color: #f59e0b !important; }
        .testimonial-slider .slick-dots li.slick-active button:before { color: #f59e0b !important; }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const testimonials = [
  {
    quote: "StarSync helped me understand my path clearly. The reading was accurate, kind, and truly transformative.",
    name: "Priya Malhotra",
    location: "Delhi, India",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    quote: "The astrologer guided me through a crucial career decision. So insightful!",
    name: "Rahul Sharma",
    location: "Mumbai, India",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "Amazing tarot reading experience! Very personal and detailed guidance.",
    name: "Anita Verma",
    location: "Bengaluru, India",
    image: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    quote: "Highly recommend StarSync for anyone seeking clarity in life and relationships.",
    name: "Sandeep Singh",
    location: "Chandigarh, India",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
]

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const TestimonialSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  return (
    <section id="reviews" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-amber-500 mb-12">What Our Clients Say</h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="px-4 py-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center transition hover:shadow-amber-500/50">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-amber-500"
                />
                <div className="flex justify-center gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <blockquote className="text-gray-800 italic mb-4 text-lg md:text-xl">"{t.quote}"</blockquote>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-600">{t.location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default TestimonialSection

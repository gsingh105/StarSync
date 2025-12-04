import React from 'react'
import Navbar from '../components/common/Navbar'
import HeroSection from './Home/HeroSection'
import FeaturesSection from './Home/FeaturesSection'
import TestimonialSection from './Home/TestimonialSection'
import Footer from './Home/Footer'


const Home = () => (
  <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <Navbar />
    <main className="pt-20">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
    </main>
    <Footer />
  </div>
)

export default Home

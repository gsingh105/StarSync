import React from 'react'
import Navbar from '../components/common/Navbar' // Check path
import HeroSection from '../components/HeroSection' // Check path
import FeaturesSection from '../components/FeaturesSection' // Check path
import TestimonialSection from '../components/TestimonialSection' // Check path
import Footer from '../components/common/Footer' // Check path

const Home = () => (
  <div className="min-h-screen font-sans selection:bg-amber-500/30">
    <main className="transition-colors duration-500">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
    </main>
  </div>
)

export default Home
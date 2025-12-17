import React from 'react'
import Navbar from '../components/common/Navbar' // Check path
import HeroSection from '../components/HeroSection' // Check path
import FeaturesSection from '../components/FeaturesSection' // Check path
import TestimonialSection from '../components/TestimonialSection' // Check path
import Footer from '../components/common/Footer' // Check path

const Home = () => (
  // Added dark:bg-slate-950 to the main wrapper
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-500">
    <Navbar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
    </main>
    {/* <Footer /> */}
  </div>
)

export default Home
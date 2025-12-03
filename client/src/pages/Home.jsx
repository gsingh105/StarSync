import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// 1. Import Leaflet components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix Leaflet Default Icon Issue ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- Classic Assets / Icons ---
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const FeatureIcon1 = () => (
  <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
  </svg>
);
const FeatureIcon2 = () => (
  <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
  </svg>
);
const FeatureIcon3 = () => (
  <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
  </svg>
);

const Divider = () => (
  <div className="flex items-center justify-center py-8 opacity-50">
     <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
     <div className="mx-2 text-amber-500">✦</div>
     <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
  </div>
);

const features = [
  {
    icon: <FeatureIcon1 />,
    title: "Live Consultation",
    description: "Instant discourse with learned Vedic scholars and Tarot experts.",
    color: "from-[#1a1625] to-[#121212]",
    border: "border-amber-500/20"
  },
  {
    icon: <FeatureIcon2 />,
    title: "Vedic Horoscopes",
    description: "Ancient wisdom tailored to your birth chart using precise planetary calculations.",
    color: "from-[#1a1625] to-[#121212]",
    border: "border-amber-500/20"
  },
  {
    icon: <FeatureIcon3 />,
    title: "Cosmic Union",
    description: "Profound synastry reports analyzing the threads of destiny between souls.",
    color: "from-[#1a1625] to-[#121212]",
    border: "border-amber-500/20"
  },
];

const testimonial = {
  quote: "StarSync revealed paths I had not seen. It is not merely an app; it is a modern oracle. The guidance was profound and eerily accurate.",
  name: "Anya Sharma",
  role: "Mumbai, India",
  stars: 5
};

// Location for Mohali, Punjab
const POSITION = [30.7046, 76.7179];

const Home = () => {
  const { user, loading, logout } = useAuth(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
        if (!e.target.closest('.user-menu')) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden selection:bg-amber-900 selection:text-amber-100">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        /* Fix for Leaflet Map Z-Index */
        .leaflet-container {
            width: 100%;
            height: 100%;
            z-index: 0;
            background: #0a0a0c;
        }
      `}</style>

      {/* ... Texture and Glows ... */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-6">
          <div className="relative flex items-center justify-between h-20 px-8 rounded-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-amber-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <StarIcon className="relative w-6 h-6 text-amber-400" />
                </div>
                <span className="text-2xl font-cinzel font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
                  StarSync
                </span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              {['Services', 'Why Us', 'Reviews', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="font-cinzel text-xs font-semibold tracking-widest text-amber-100/70 hover:text-amber-400 transition-colors uppercase">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
              ) : user ? (
                <div className="relative user-menu">
                  <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 focus:outline-none group">
                    <span className="hidden md:block text-sm font-playfair italic text-amber-100">{user.name || user.fullName}</span>
                    <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-[#15151a] flex items-center justify-center text-amber-400 font-cinzel shadow-lg group-hover:border-amber-400 transition-colors overflow-hidden">
                      {user.profileImage ? (
                          <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                          getUserInitials(user.name || user.fullName)
                      )}
                    </div>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-64 rounded-sm bg-[#0a0a0c] border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 z-50">
                        <div className="px-5 py-4 border-b border-amber-500/10">
                          <p className="text-[10px] font-cinzel text-amber-500 tracking-widest uppercase mb-1">Signed in as</p>
                          <p className="text-sm font-playfair text-amber-100 truncate italic">{user.email}</p>
                          {user.role === 'astrologer' && (
                              <span className="inline-block mt-1 text-[10px] bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">MASTER ACCOUNT</span>
                          )}
                        </div>
                        <div className="py-2">
                            <Link to={user.role === 'astrologer' ? "/astrologer/dashboard" : "/dashboard"} className="block px-5 py-2.5 text-xs font-cinzel tracking-wider text-gray-400 hover:text-amber-400 hover:bg-amber-900/10 uppercase">
                                {user.role === 'astrologer' ? "Partner Dashboard" : "My Dashboard"}
                            </Link>
                            <Link to="/profile" className="block px-5 py-2.5 text-xs font-cinzel tracking-wider text-gray-400 hover:text-amber-400 hover:bg-amber-900/10 uppercase">Profile Settings</Link>
                        </div>
                        <div className="h-px bg-amber-500/10 my-1 mx-4"></div>
                        <div className="py-2">
                            <button onClick={handleLogout} className="block w-full text-left px-5 py-2.5 text-xs font-cinzel tracking-wider text-red-400 hover:bg-red-900/10 hover:text-red-300 uppercase">Sign Out</button>
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* --- NEW ASTROLOGER LOGIN BUTTON --- */}
                  <Link to="/astrologer/login" className="hidden lg:block text-[10px] font-cinzel font-bold text-amber-500/60 hover:text-amber-500 uppercase tracking-widest mr-2 transition-colors">
                     Partner Login
                  </Link>

                  <Link to="/login" className="hidden md:block text-sm font-cinzel font-semibold text-amber-200/80 hover:text-amber-100">Log in</Link>
                  <Link to="/register" className="px-6 py-2.5 text-xs font-cinzel font-bold tracking-widest text-[#050505] bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]">Consult Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
            <div className="inline-block mb-6">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-900/10 backdrop-blur-sm">
                    <span className="text-amber-400 text-lg">✦</span>
                    <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-amber-200 uppercase">Vedic Wisdom Meets Modern Tech</span>
                    <span className="text-amber-400 text-lg">✦</span>
                </div>
            </div>
            <h1 className="font-cinzel text-5xl md:text-8xl font-medium tracking-tight mb-8 leading-tight text-white">
                Destiny, <br />
                <span className="italic font-playfair text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">Decoded.</span>
            </h1>
            <p className="max-w-2xl mx-auto font-playfair text-xl text-gray-400 mb-12 italic leading-relaxed">
                "The stars do not compel, they incline." <br/>
                <span className="text-base font-sans not-italic text-gray-500 mt-2 block">Connect with certified masters of the Vedic arts for clarity on love, career, and life's great tapestry.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto px-10 py-4 border border-amber-500/50 bg-[#1a1500] hover:bg-[#2a2200] text-amber-100 font-cinzel font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group">
                    <span className="relative z-10">Read My Chart</span>
                    <div className="absolute inset-0 bg-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
            </div>
        </section>

        <Divider />

        {/* Features Section */}
        <section id="services" className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="font-cinzel text-3xl md:text-4xl text-amber-100 mb-3">Our Sacred Offerings</h2>
                <p className="font-playfair italic text-gray-400">Services curated for the modern seeker</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <div key={idx} className={`group relative p-8 bg-gradient-to-b ${feature.color} border border-white/5 hover:border-amber-500/40 transition-all duration-500`}>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/50"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/50"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/50"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/50"></div>
                        <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-1">
                            {feature.icon}
                        </div>
                        <h3 className="font-cinzel text-xl font-bold text-amber-100 mb-4">{feature.title}</h3>
                        <p className="font-serif text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Testimonial Section */}
        <section id="reviews" className="py-20 px-6">
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute -top-10 -left-10 text-9xl font-serif text-amber-500/10 leading-none">“</div>
                <div className="border-y border-amber-500/20 py-12 text-center bg-[#0a0a0c]/50 backdrop-blur-sm">
                    <div className="flex justify-center gap-2 mb-6 text-amber-500">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
                    </div>
                    <blockquote className="font-playfair text-2xl md:text-3xl text-gray-200 italic mb-8 leading-normal">
                        {testimonial.quote}
                    </blockquote>
                    <cite className="not-italic">
                        <span className="block font-cinzel text-amber-400 font-bold tracking-widest text-sm">{testimonial.name}</span>
                        <span className="block font-sans text-xs text-gray-500 mt-1 uppercase tracking-wider">{testimonial.role}</span>
                    </cite>
                </div>
            </div>
        </section>

        {/* --- MAP SECTION --- */}
        <section id="contact" className="relative pb-32 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="font-cinzel text-3xl text-white">Sanctum Location</h2>
                    <div className="h-px w-20 bg-amber-500/50 mx-auto mt-4"></div>
                </div>
                
                {/* Map Frame */}
                <div className="relative p-2 border border-amber-500/20 rounded-sm">
                    {/* Inner gold border */}
                    <div className="absolute inset-2 border border-amber-500/10 pointer-events-none z-20"></div>
                    
                    <div className="w-full h-[450px] relative z-0">
                        <MapContainer 
                            center={POSITION} 
                            zoom={13} 
                            scrollWheelZoom={false} 
                            attributionControl={false}
                        >
                            {/* Dark Theme Map Tiles */}
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            <Marker position={POSITION}>
                                <Popup className="font-cinzel">
                                    <span className="text-amber-900 font-bold">StarSync Sanctum</span> <br /> Mohali, Punjab
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
                
                <div className="text-center mt-6 font-cinzel text-xs text-amber-500/50 tracking-[0.3em]">
                    LAT: {POSITION[0]} • LONG: {POSITION[1]}
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t border-amber-500/10 bg-[#050505] py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <StarIcon className="w-6 h-6 text-amber-700 mx-auto mb-4" />
            <p className="font-cinzel text-xs text-gray-500 tracking-widest uppercase mb-4">
                &copy; {new Date().getFullYear()} StarSync • Guided by the Stars
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
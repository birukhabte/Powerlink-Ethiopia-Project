import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe, ChevronDown, Bell, Info, Calendar, Minimize2, Maximize2, Wrench, Moon, Sun } from 'lucide-react';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import useAnnouncements from '../hooks/useAnnouncements';
import logo1 from '../assets/logo1.jpg';
import teamImage from '../assets/back gallery/team.png';
import backImage from '../assets/back gallery/back.png';
import personImage from '../assets/back gallery/image.png';
import halfImage from '../assets/back gallery/half.png';
import lightedCityImage from '../assets/back gallery/lighted city.png';

// ... (keep imports)

const Home = () => {
    const [activeNav, setActiveNav] = useState('home');
    const [language, setLanguage] = useState('en');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Gallery images array - Order: team, back, image, half, lighted city
    const galleryImages = [teamImage, backImage, personImage, halfImage, lightedCityImage];
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAnnouncementsCollapsed, setIsAnnouncementsCollapsed] = useState(false);

    // Use the custom hook to fetch announcements
    const { announcements, loading, error, refetch } = useAnnouncements();
    
    // Autoplay background images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
        }, 5000); // Change image every 5 seconds
        
        return () => clearInterval(interval);
    }, [galleryImages.length]);

    // Debug logging
    console.log('🏠 Home component - Announcements state:', {
        announcements,
        loading,
        error,
        count: announcements.length
    });

    const translations = {
        en: {
            home: 'Home',
            about: 'About Us',
            services: 'Services',
            contact: 'Contact',
            login: 'Login',
            register: 'Register',
            welcome: 'Welcome to',
            tagline: 'Your digital platform for reporting outages, tracking repairs, and managing electricity services with real-time updates.',
            custLogin: 'Customer Login',
            newReg: 'New Registration',
            outageMap: 'Live Outage Map',
            f1: 'Real-time Reporting',
            f2: 'Mobile Friendly',
            f3: '24/7 Support',
            footerTagline: 'Your digital platform for reporting outages, tracking repairs, and managing electricity services with real-time updates.',
            rights: 'All rights reserved',
            announcementTitle: 'Announcements',
            viewAll: 'View All',
            collapsedMsg: 'You have new announcements'
        },
        am: {
            home: 'ዋና ገጽ',
            about: 'ስለ እኛ',
            services: 'አገልግሎቶች',
            contact: 'ያግኙን',
            login: 'ይግቡ',
            register: 'ይመዝገቡ',
            welcome: 'እንኳን ወደ',
            tagline: 'የኤሌክትሪክ መቆራረጥን ሪፖርት የሚያደርጉበት፣ ጥገናዎችን የሚከታተሉበት እና የኤሌክትሪክ አገልግሎቶችን በቅጽበት የሚያስተዳድሩበት ዲጂታል ፕላትፎርም',
            custLogin: 'የደንበኛ መግቢያ',
            newReg: 'አዲስ ምዝገባ',
            outageMap: 'የቀጥታ መቆራረጥ ካርታ',
            f1: 'ቀጥታ ሪፖርት ማድረጊያ',
            f2: 'ለስልክ ምቹ',
            f3: 'የ24/7 ድጋፍ',
            footerTagline: 'ለተሻለች ኢትዮጵያ መብራት እናበራለን።',
            rights: 'መብቱ በህግ የተጠበቀ ነው',
            announcementTitle: 'ማስታወቂያዎች',
            viewAll: 'ሁሉንም ይመልከቱ',
            collapsedMsg: 'አዲስ ማስታወቂያዎች አሉዎት'
        }
    };

    const navLinks = [
        { id: 'home', label: translations[language].home, href: '/', isLink: true },
        { id: 'about', label: translations[language].about, href: '#about' },
        { id: 'services', label: translations[language].services, href: '#services' },
        { id: 'contact', label: translations[language].contact, href: '#contact' },
    ];

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
            {/* Navigation */}
            <nav className={`flex items-center p-3 shadow-md sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-[#0802A3] border-b border-[#06018a]' : 'bg-white'}`}>
                {/* Logo Section */}
                <Link
                    to="/"
                    onClick={() => {
                        setActiveNav('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-3 w-1/4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <img src={logo1} alt="PowerLink Logo" className="h-12 w-auto object-contain" />
                    <span className="text-2xl font-bold text-[#00B7B5] tracking-tight">PowerLink</span>
                </Link>

                {/* Navigation Links - Centered */}
                <div className="flex-1 flex justify-center space-x-8 font-medium">
                    {navLinks.map((link) => (
                        link.isLink ? (
                            <Link
                                key={link.id}
                                to={link.href}
                                onClick={() => {
                                    setActiveNav(link.id);
                                    if (link.id === 'home') {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className={`pb-1 transition-all duration-300 border-b-2 ${activeNav === link.id
                                    ? 'text-[#0802A3] border-[#0802A3]'
                                    : isDarkMode ? 'text-gray-200 border-transparent hover:text-[#0802A3]' : 'text-[#0802A3] border-transparent hover:border-[#0802A3]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.id}
                                href={link.href}
                                onClick={() => setActiveNav(link.id)}
                                className={`pb-1 transition-all duration-300 border-b-2 ${activeNav === link.id
                                    ? 'text-[#0802A3] border-[#0802A3]'
                                    : isDarkMode ? 'text-gray-200 border-transparent hover:text-[#0802A3]' : 'text-[#0802A3] border-transparent hover:border-[#0802A3]'
                                    }`}
                            >
                                {link.label}
                            </a>
                        )
                    ))}
                </div>

                {/* Auth & Language Buttons - Right Side */}
                <div className="flex items-center space-x-4 w-1/4 justify-end">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Language Selector */}
                    <div className={`relative group px-3 py-2 flex items-center space-x-1 cursor-pointer transition-colors border rounded-lg ${isDarkMode ? 'text-gray-200 border-gray-400 hover:border-white hover:text-white' : 'text-[#0802A3] border-gray-300 hover:border-[#0802A3]'}`}>
                        <Globe size={18} />
                        <span className="text-sm font-semibold">{language === 'en' ? 'EN' : 'አማ'}</span>
                        <ChevronDown size={14} />

                        {/* Dropdown Menu */}
                        <div className={`absolute top-full right-0 mt-2 w-32 border shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] bg-white border-gray-100`}>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${language === 'en'
                                    ? 'text-[#0802A3] font-bold bg-blue-50/50'
                                    : 'text-gray-700'
                                    }`}
                            >
                                English {language === 'en' && <div className="w-1.5 h-1.5 bg-[#0802A3] rounded-full"></div>}
                            </button>
                            <button
                                onClick={() => setLanguage('am')}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${language === 'am'
                                    ? 'text-[#0802A3] font-bold bg-blue-50/50'
                                    : 'text-gray-700'
                                    }`}
                            >
                                አማርኛ {language === 'am' && <div className="w-1.5 h-1.5 bg-[#0802A3] rounded-full"></div>}
                            </button>
                        </div>
                    </div>

                    <Link to="/login" className={`px-4 py-2 font-semibold transition ${isDarkMode ? 'text-white hover:text-gray-200' : 'text-[#0802A3] hover:text-[#06018a]'}`}>
                        {translations[language].login}
                    </Link>
                    <Link to="/register" className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${isDarkMode ? 'bg-white text-[#0802A3] hover:bg-gray-100' : 'bg-[#0802A3] text-white hover:bg-[#06018a]'}`}>
                        {translations[language].register}
                    </Link>
                </div>
            </nav>
            {/* Hero Section */}
            <main className="relative min-h-screen flex overflow-hidden">
                {/* Fullscreen Background Image Slideshow */}
                <div className="w-full h-screen relative overflow-hidden bg-black">
                    {/* Background Image Slideshow */}
                    {galleryImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`PowerLink Background ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={
                                index === 1 ? { objectPosition: 'center 30%' } : // back.png - show all persons
                                index === 2 ? { objectPosition: 'center 30%' } : // image.png - show person's face
                                {}
                            }
                        />
                    ))}
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                    {/* Welcome Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center px-6 max-w-4xl">
                            <motion.h1
                                className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                Welcome to PowerLink Ethiopia
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-white/90 font-light drop-shadow-lg"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                Powering homes, businesses, and communities for a brighter Ethiopia.
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Announcement Card - Right Side */}
                <div className={`hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-in-out ${isAnnouncementsCollapsed ? 'w-12 h-12 overflow-hidden' : 'w-80 h-auto'}`} style={{ right: 'calc(50% + 1rem)' }}>
                    {isAnnouncementsCollapsed ? (
                        <button
                            onClick={() => setIsAnnouncementsCollapsed(false)}
                            className="bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all animate-bounce flex items-center justify-center"
                            title={translations[language].announcementTitle}
                        >
                            <Bell size={24} />
                            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
                        </button>
                    ) : (
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[500px] animate-fade-in-right">
                            <div className="p-4 bg-blue-600/30 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-white">
                                    <Bell size={20} className="animate-pulse" />
                                    <h2 className="font-bold text-lg">{translations[language].announcementTitle}</h2>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                                    <button
                                        onClick={() => setIsAnnouncementsCollapsed(true)}
                                        className="text-white/60 hover:text-white transition-colors p-1"
                                    >
                                        <Minimize2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-4 space-y-4 scrollbar-hide flex-1">
                                {loading ? (
                                    <div className="text-center text-white/60 py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto mb-2"></div>
                                        <p className="text-sm">Loading announcements...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center text-red-400 py-8">
                                        <AlertTriangle size={24} className="mx-auto mb-2" />
                                        <p className="text-sm">{error}</p>
                                        <button
                                            onClick={refetch}
                                            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : announcements.length === 0 ? (
                                    <div className="text-center text-white/60 py-8">
                                        <Bell size={24} className="mx-auto mb-2" />
                                        <p className="text-sm">No announcements available</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="group p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 cursor-default">
                                            <div className="flex items-start space-x-3">
                                                <div className={`mt-1 p-1.5 rounded-lg ${announcement.type === 'error' || announcement.type === 'warning'
                                                    ? 'bg-red-500/20 text-red-500'
                                                    : announcement.type === 'warning'
                                                        ? 'bg-amber-500/20 text-amber-500'
                                                        : 'bg-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {announcement.type === 'error' || announcement.type === 'warning' ? (
                                                        <AlertTriangle size={14} />
                                                    ) : announcement.type === 'warning' ? (
                                                        <Wrench size={14} />
                                                    ) : (
                                                        <Info size={14} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold text-sm truncate">{announcement.title}</h3>
                                                    <p className="text-gray-300 text-xs mt-1 line-clamp-3 leading-relaxed">
                                                        {announcement.content}
                                                    </p>
                                                    <div className="flex items-center mt-2 text-[10px] text-gray-400">
                                                        <Calendar size={10} className="mr-1" />
                                                        {announcement.date}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <button className="w-full py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center justify-center space-x-1">
                                    <span>{translations[language].viewAll}</span>
                                    <ChevronDown size={14} className="-rotate-90" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Announcement Section - At the bottom of Hero */}
                <div className="lg:hidden w-full mt-12 px-2 animate-fade-in-up [animation-delay:1000ms]">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-3 bg-blue-600/30 border-b border-white/10 flex items-center justify-between text-white">
                            <div className="flex items-center space-x-2">
                                <Bell size={18} />
                                <h2 className="font-bold text-sm">{translations[language].announcementTitle}</h2>
                            </div>
                            <button
                                onClick={() => setIsAnnouncementsCollapsed(!isAnnouncementsCollapsed)}
                                className="text-white/60 hover:text-white transition-colors p-1"
                            >
                                {isAnnouncementsCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                        </div>
                        {!isAnnouncementsCollapsed && (
                            <div className="flex overflow-x-auto p-3 gap-4 snap-x scrollbar-hide">
                                {loading ? (
                                    <div className="min-w-[280px] text-center text-white/60 py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60 mx-auto mb-2"></div>
                                        <p className="text-xs">Loading...</p>
                                    </div>
                                ) : error ? (
                                    <div className="min-w-[280px] text-center text-red-400 py-8">
                                        <AlertTriangle size={20} className="mx-auto mb-2" />
                                        <p className="text-xs">{error}</p>
                                    </div>
                                ) : announcements.length === 0 ? (
                                    <div className="min-w-[280px] text-center text-white/60 py-8">
                                        <Bell size={20} className="mx-auto mb-2" />
                                        <p className="text-xs">No announcements</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="min-w-[280px] snap-center p-3 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-white font-semibold text-sm truncate">{announcement.title}</h3>
                                                <span className="text-[10px] text-gray-400">{announcement.date}</span>
                                            </div>
                                            <p className="text-gray-300 text-xs line-clamp-2">{announcement.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* About Section */}
            <About isDarkMode={isDarkMode} />

            {/* Services Section */}
            <Services isDarkMode={isDarkMode} />

            {/* Contact Section */}
            <Contact isDarkMode={isDarkMode} />

            {/* Footer */}
            <footer className={`${isDarkMode ? 'bg-black' : 'bg-gray-900'} text-white py-12 px-6 text-center`}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-2xl font-bold mb-4">PowerLink Ethiopia</div>
                    <p className="text-gray-400 mb-6">{translations[language].footerTagline}</p>
                    <div className="border-t border-gray-800 pt-8 text-gray-500">
                        <p>© 2024 PowerLink Ethiopia • {translations[language].rights} • support@powerlink.et</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

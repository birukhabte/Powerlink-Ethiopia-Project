import React from 'react';
import { Users, Target, Clock, Award, Shield, Globe } from 'lucide-react';
import mission from '../assets/mission.png';
import twentyFourSeven from '../assets/24sevenn.jpg';
import award from '../assets/award.jpg';


const AboutUs = ({ isDarkMode = false }) => {
    const features = [
        {
            icon: <Target />,
            title: 'Our Mission',
            desc: 'Reliable power service for all Ethiopians',
            image: mission
        },
        {
            icon: <Clock />,
            title: '24/7 Service',
            desc: 'Round-the-clock outage response',
            image: twentyFourSeven
        },
        {
            icon: <Award />,
            title: 'Excellence',
            desc: 'Award-winning service quality',
            image: award // Excellence/award image
        },
        {
            icon: <Shield />,
            title: 'Security',
            desc: 'Protected customer data',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop' // Security/protection image
        },
    ];

    return (
        <div id="about" className={`py-20 px-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>About PowerLink Ethiopia</h2>
                    <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Transforming electricity service delivery through digital innovation
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left - Image/Stats */}
                    <div className="space-y-8">
                        <div className="bg-blue-50 p-8 rounded-2xl">
                            <div className="flex justify-around text-center">
                                {['50K+', '24/7', '<2hr'].map((stat, idx) => (
                                    <div key={idx}>
                                        <div className="text-3xl font-bold text-blue-700">{stat}</div>
                                        <div className="text-gray-600 text-sm mt-2">
                                            {['Users', 'Service', 'Response'][idx]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            PowerLink is Ethiopia's premier digital platform for electricity service management,
                            combining cutting-edge technology with customer-centric solutions.
                        </p>
                    </div>

                    {/* Right - Features */}
                    <div className="grid grid-cols-2 gap-6">
                        {features.map((item, idx) => (
                            <div key={idx} className={`rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                                {/* Feature Image */}
                                <div className="relative w-full overflow-hidden bg-gray-50" style={{ minHeight: '200px', height: '200px' }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        style={{ objectPosition: 'center 50%' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {/* Remove overlay for mission card to make text visible, minimal overlay for others */}
                                    {idx !== 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mt-16 text-center">
                    <Users className="mx-auto text-blue-600 mb-4" size={40} />
                    <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Team</h3>
                    <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        200+ dedicated professionals including engineers, technicians, and customer
                        support specialists working together to keep Ethiopia powered.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
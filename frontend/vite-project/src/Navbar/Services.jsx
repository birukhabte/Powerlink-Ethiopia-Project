import React, { useState } from 'react';
import { Wrench, Home, FileText, Zap, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import bulboff from '../assets/bulboff.jpg';
import connections from '../assets/connections.jpg';
import relocation from '../assets/relocation.jpg';
import urgent from '../assets/urgent.jpg';




const Services = ({ isDarkMode = false }) => {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            icon: <Zap />,
            title: 'Outage Reporting',
            desc: 'Report power outages instantly',
            features: ['Real-time tracking', 'GIS location', 'Priority handling'],
            time: 'Immediate',
            image: bulboff, // Power outage image
        },
        {
            icon: <Home />,
            title: 'New Connection',
            desc: 'Request new electricity connection',
            features: ['Online application', 'Document upload', 'Progress tracking'],
            time: '7-14 days',
            image: connections, // Electrical connection
        },
        {
            icon: <Wrench />,
            title: 'Relocation',
            desc: 'Transfer service to new address',
            features: ['Address change', 'Meter transfer', 'No downtime'],
            time: '2-5 days',
            image: relocation, // Moving/relocation
        },
        {
            icon: <FileText />,
            title: 'Name Change',
            desc: 'Update account ownership',
            features: ['Legal transfer', 'Document verification', 'Digital signing'],
            time: '4-6 days',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop', // Documents/legal
        },
        {
            icon: <DollarSign />,
            title: 'Tariff Change',
            desc: 'Modify billing plan',
            features: ['Plan comparison', 'Cost calculator', 'Instant update'],
            time: '24 hours',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', // Billing/money
        },
        {
            icon: <AlertTriangle />,
            title: 'Urgent Services',
            desc: 'Priority for hospitals/businesses',
            features: ['24/7 support', 'Dedicated team', 'Fast response'],
            time: '< 2 hours',
            image: urgent, // Emergency/urgent
        }
    ];

    return (
        <div id="services" className={`min-h-screen py-20 px-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gradient-to-b from-blue-50 to-gray-100'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Services</h1>
                    <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Comprehensive digital solutions for all your electricity service needs
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedService(idx)}
                            className={`rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${selectedService === idx ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            {/* Service Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>
                                    <p className="text-white/90 text-sm">{service.desc}</p>
                                </div>
                            </div>

                            <div className="p-6">

                                {/* Features */}
                                <div className="space-y-2 mb-4">
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-center text-sm">
                                            <CheckCircle className="text-green-500 mr-2" size={16} />
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Info */}
                                <div className={`flex justify-between items-center pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                                    <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <Clock size={16} className="mr-1" />
                                        <span className="text-sm">{service.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Service Details */}
                {selectedService !== null && (
                    <div className={`mt-12 p-6 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-200'}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Selected: {services[selectedService].title}
                        </h3>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Request This Service
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
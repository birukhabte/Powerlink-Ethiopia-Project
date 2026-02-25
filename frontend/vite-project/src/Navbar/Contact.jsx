import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = ({ isDarkMode = false }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    const contactInfo = [
        { icon: <Mail />, title: 'Customer Support', detail: 'support@powerlink.et', desc: 'Email Response: < 2 hours' },
        { icon: <MessageSquare />, title: 'WhatsApp', detail: '+251 91 234 5678', desc: 'Business Hours: 8AM-8PM' },
        { icon: <MapPin />, title: 'Head Office', detail: 'Addis Ababa, Ethiopia', desc: 'Kirkos Subcity, Street 123' }
    ];

    return (
        <div id="contact" className={`min-h-screen py-20 px-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Contact Us</h1>
                    <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get in touch with our support team</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Contact Info */}
                    <div className="space-y-8">
                        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Contact Information</h2>
                        {contactInfo.map((info, idx) => (
                            <div key={idx} className={`flex items-start p-6 rounded-xl shadow-md hover:shadow-lg transition ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-sm mr-4">{info.icon}</div>
                                <div>
                                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{info.title}</h3>
                                    <p className={`font-semibold text-base my-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{info.detail}</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{info.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Contact Form */}
                    <div className={`p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Send Message</h2>

                        {submitted ? (
                            <div className="text-center py-8 bg-green-50 rounded-xl">
                                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Message Sent!</h3>
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>We'll respond within 2 business hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                                        placeholder="Describe your issue or question..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center"
                                >
                                    <Send className="mr-2" /> Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className={`mt-16 rounded-2xl p-8 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                    <MapPin className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={48} />
                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Service Area Map</h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Coming soon: Interactive map showing our service coverage across Ethiopia</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
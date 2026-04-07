import React, { useState } from 'react';
import { UserPlus, Building, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Registration = () => {
    const [language, setLanguage] = useState('am'); // Default to Amharic as requested
    const [hasBP, setHasBP] = useState(true); // Default to having BP number
    const [formData, setFormData] = useState({
        userType: 'customer',
        fullName: '',
        email: '',
        bpNumber: '',
        phone: '',
        specialType: 'hospital',
        otherSpecialType: '',
        password: '',
        confirmPassword: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const translations = {
        en: {
            title: 'Create Account',
            subtitle: 'Join PowerLink Ethiopia',
            regAs: 'Register As',
            cust: 'Customer (Residential)',
            special: 'Special Customer (Business)',
            busType: 'Business Type',
            specify: 'Specify Type',
            name: 'Full Name',
            email: 'Email Address',
            bpLabel: 'BP Number',
            hasBpQuestion: 'Do you have a BP Number?',
            yes: 'Yes',
            no: 'No',
            phone: 'Phone Number',
            pass: 'Password',
            confirm: 'Confirm Password',
            btn: 'Create Account',
            submitting: 'Creating Account...',
            already: 'Already have an account?',
            signin: 'Sign In',
            success: 'Registration Successful!',
            successMsg: 'Your account has been created.',
            loginBtn: 'Go to Login',
            fixErrors: 'Please fix required fields.',
            hospital: '🏥 Hospital',
            school: '🏫 School',
            factory: '🏭 Factory',
            hotel: '🏨 Hotel',
            other: 'Other Business'
        },
        am: {
            title: 'መለያ ይፍጠሩ',
            subtitle: 'ከ PowerLink ኢትዮጵያ ጋር ይቀላቀሉ',
            regAs: 'የምዝገባ ዓይነት',
            cust: 'ደንበኛ (መኖሪያ ቤት)',
            special: 'ልዩ ደንበኛ (ንግድ)',
            busType: 'የንግድ ዓይነት',
            specify: 'ዓይነቱን ይግለጹ',
            name: 'ሙሉ ስም',
            email: 'ኢሜይል',
            bpLabel: 'የ BP ቁጥር',
            hasBpQuestion: 'የ BP ቁጥር አለዎት?',
            yes: 'አዎ',
            no: 'አይ',
            phone: 'ስልክ ቁጥር',
            pass: 'የይለፍ ቃል',
            confirm: 'የይለፍ ቃል ያረጋግጡ',
            btn: 'መለያ ይፍጠሩ',
            submitting: 'በመመዝገብ ላይ...',
            already: 'መለያ አለዎት?',
            signin: 'ይግቡ',
            success: 'ምዝገባው ተሳክቷል!',
            successMsg: 'መለያዎ በተሳካ ሁኔታ ተፈጥሯል።',
            loginBtn: 'ወደ መግቢያ ይሂዱ',
            fixErrors: 'እባክዎ የተጠየቁትን መረጃዎች ያስተካክሉ።',
            hospital: '🏥 ሆስፒታል',
            school: '🏫 ትምህርት ቤት',
            factory: '🏭 ፋብሪካ',
            hotel: '🏨 ሆቴል',
            other: 'ሌላ ንግድ'
        }
    };

    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = {};

        // Validation
        if (!formData.fullName) newErrors.fullName = 'Name required';

        if (hasBP) {
            if (!formData.bpNumber) newErrors.bpNumber = 'BP Number required';
        } else {
            if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
        }

        if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
        if (formData.userType === 'special' && formData.specialType === 'other' && !formData.otherSpecialType)
            newErrors.otherSpecialType = 'Please specify';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Prepare registration data
            const registrationData = {
                email: !hasBP ? formData.email : null,
                bpNumber: hasBP ? formData.bpNumber : null,
                username: hasBP ? formData.bpNumber : formData.email.split('@')[0], // Use BP or email prefix
                password: formData.password,
                firstName: formData.fullName.split(' ')[0],
                lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName.split(' ')[0],
                phone: formData.phone,
                userType: formData.userType,
                specialType: formData.userType === 'special' ? formData.specialType : null,
                otherSpecialType: formData.userType === 'special' && formData.specialType === 'other' ? formData.otherSpecialType : null
            };

            // Make API call to backend
            const response = await axios.post(API_ENDPOINTS.auth.register, registrationData);

            console.log('Registration successful:', response.data);
            setSubmitted(true);
            setLoading(false);

        } catch (error) {
            console.error('Registration error:', error);
            setLoading(false);

            // Handle different error scenarios
            if (error.response) {
                // Server responded with error
                setErrors({
                    general: error.response.data.error || 'Registration failed. Please try again.'
                });
            } else if (error.request) {
                // Request made but no response (backend not running)
                setErrors({
                    general: 'Cannot connect to server. Please ensure the backend is running.'
                });
            } else {
                // Something else happened
                setErrors({
                    general: 'An unexpected error occurred. Please try again.'
                });
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl animate-fade-in-up relative">

                {/* Language Toggle */}
                <div className="absolute top-6 right-6 flex space-x-2">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('am')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${language === 'am' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        አማ
                    </button>
                </div>

                {submitted ? (
                    <div className="text-center py-6">
                        <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.success}</h2>
                        <p className="text-gray-600 mb-6">{t.successMsg}</p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                        >
                            {t.loginBtn}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <UserPlus className="mx-auto text-blue-600 mb-2" size={40} />
                            <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
                            <p className="text-gray-600 text-sm">{t.subtitle}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* User Type Selection */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">{t.regAs}</label>
                                    <select
                                        value={formData.userType}
                                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="customer">{t.cust}</option>
                                        <option value="special">{t.special}</option>
                                    </select>
                                </div>

                                {/* BP Number Toggle */}
                                <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <label className="block text-blue-800 text-sm font-medium mb-2">{t.hasBpQuestion}</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={hasBP === true}
                                                onChange={() => setHasBP(true)}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-gray-700 text-sm font-medium">{t.yes}</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={hasBP === false}
                                                onChange={() => setHasBP(false)}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-gray-700 text-sm font-medium">{t.no}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Special Customer Type */}
                                {formData.userType === 'special' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">{t.busType}</label>
                                            <select
                                                value={formData.specialType}
                                                onChange={(e) => setFormData({ ...formData, specialType: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            >
                                                <option value="hospital">{t.hospital}</option>
                                                <option value="school">{t.school}</option>
                                                <option value="factory">{t.factory}</option>
                                                <option value="hotel">{t.hotel}</option>
                                                <option value="other">{t.other}</option>
                                            </select>
                                        </div>

                                        {formData.specialType === 'other' ? (
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">{t.specify}</label>
                                                <input
                                                    type="text"
                                                    value={formData.otherSpecialType}
                                                    onChange={(e) => setFormData({ ...formData, otherSpecialType: e.target.value })}
                                                    placeholder={t.specify}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        ) : <div className="hidden md:block"></div>}
                                    </div>
                                )}

                                {/* Identifier: BP or Email */}
                                {hasBP ? (
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">{t.bpLabel}</label>
                                        <input
                                            type="text"
                                            placeholder={t.bpLabel}
                                            value={formData.bpNumber}
                                            onChange={(e) => setFormData({ ...formData, bpNumber: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            required={hasBP}
                                        />
                                    </div>
                                ) : (
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">{t.email}</label>
                                        <input
                                            type="email"
                                            placeholder={t.email}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                            required={!hasBP}
                                        />
                                    </div>
                                )}

                                {/* Basic Info */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">{t.name}</label>
                                    <input
                                        type="text"
                                        placeholder={t.name}
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">{t.phone}</label>
                                    <input
                                        type="tel"
                                        placeholder={t.phone}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                    />
                                </div>

                                {/* Passwords */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">{t.pass}</label>
                                    <input
                                        type="password"
                                        placeholder={t.pass}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">{t.confirm}</label>
                                    <input
                                        type="password"
                                        placeholder={t.confirm}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Display */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start">
                                    <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                                    <span className="text-red-600 text-sm">{errors.general}</span>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && !errors.general && (
                                <div className="bg-red-50 border border-red-200 p-2 rounded-lg flex items-center">
                                    <AlertCircle className="text-red-500 mr-2" size={16} />
                                    <span className="text-red-600 text-xs">{t.fixErrors}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 text-white rounded-lg font-bold shadow-lg transform hover:scale-[1.01] transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? t.submitting : t.btn}
                            </button>
                        </form>

                        <p className="text-center text-gray-600 mt-4 text-sm">
                            {t.already} <a href="/login" className="text-blue-600 font-bold hover:underline">{t.signin}</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Registration;
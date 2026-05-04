import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const Registration = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        userType: 'customer'
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = {};

        // Validation
        if (!formData.email) newErrors.email = 'Email required';
        if (!formData.username) newErrors.username = 'Username required';
        if (!formData.firstName) newErrors.firstName = 'First name required';
        if (!formData.lastName) newErrors.lastName = 'Last name required';
        if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Make API call to backend
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.toLowerCase(),
                    username: formData.username,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    userType: formData.userType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({
                    general: data.error || 'Registration failed. Please try again.'
                });
                setLoading(false);
                return;
            }

            console.log('Registration successful:', data);
            setSubmitted(true);
            setLoading(false);

        } catch (error) {
            console.error('Registration error:', error);
            setLoading(false);
            setErrors({
                general: 'Connection error. Please check if backend is running.'
            });
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in-up">

                {submitted ? (
                    <div className="text-center py-6">
                        <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                        <p className="text-gray-600 mb-6">Your account has been created. You can now login.</p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <UserPlus className="mx-auto text-blue-600 mb-2" size={40} />
                            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                            <p className="text-gray-600 text-sm">Join PowerLink Ethiopia</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    placeholder="+251911234567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* User Type */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Account Type</label>
                                <select
                                    value={formData.userType}
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="technician">Technician</option>
                                    <option value="supervisor">Supervisor</option>
                                </select>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Min 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Error Display */}
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start">
                                    <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                                    <span className="text-red-600 text-sm">{errors.general}</span>
                                </div>
                            )}

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 text-white rounded-lg font-bold shadow-lg transform hover:scale-[1.02] transition-all ${loading ? 'opacity-70 cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-gray-600 mt-4 text-sm">
                            Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Registration;
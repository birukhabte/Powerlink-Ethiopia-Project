import React, { useState } from 'react';
import { LogIn, Key, Mail, AlertCircle, User } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Client-side validation
            const newErrors = {};

            if (!loginData.password) newErrors.password = 'Password required';

            if (!loginData.email) {
                newErrors.email = 'Email or BP Number required';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            // Prepare login credentials
            const credentials = {
                email: loginData.email,
                password: loginData.password
            };

            // Make API call to backend
            const response = await axios.post(API_ENDPOINTS.auth.login, credentials);

            // Store the JWT token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            console.log('Login successful:', response.data);

            // Redirect based on user role from backend
            const userRole = response.data.user.role;
            const redirects = {
                customer: '/dashboard',
                special: '/dashboard',
                technician: '/technician-dashboard',
                supervisor: '/supervisor-dashboard',
                admin: '/admin-dashboard'
            };
            window.location.href = redirects[userRole] || '/dashboard';

        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);

            // Handle different error scenarios
            if (error.response) {
                // Server responded with error
                setErrors({
                    general: error.response.data.error || 'Login failed. Please check your credentials.'
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
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in-up">

                <div className="text-center mb-6">
                    <LogIn className="mx-auto text-blue-600 mb-2" size={40} />
                    <h1 className="text-2xl font-bold text-gray-800">PowerLink Login</h1>
                    <p className="text-gray-600 text-sm">Access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                            <Mail size={14} className="mr-2" /> Email or BP Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Email or BP Number"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password - Always required */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                            <Key size={14} className="mr-2" /> Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Error Display */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start">
                            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                            <span className="text-red-600 text-sm">{errors.general}</span>
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white rounded-lg font-bold mt-4 shadow-lg transform hover:scale-[1.02] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Help Links */}
                <div className="mt-6 text-center">
                    <a href="/forgot-password" university-data-link className="text-blue-600 text-sm font-medium hover:underline block mb-2">Forgot Password?</a>
                    <p className="text-gray-600 text-sm">
                        Don't have an account? <a href="/register" className="text-blue-600 font-bold hover:underline">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
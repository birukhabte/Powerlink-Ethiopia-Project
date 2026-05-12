import React, { useState } from 'react';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Test credentials
    const testAccounts = [
        { role: 'Admin', email: 'admin@powerlink.com', password: 'Admin@123', color: 'bg-purple-100 border-purple-300 text-purple-700' },
        { role: 'Customer', email: 'customer@powerlink.com', password: 'Customer@123', color: 'bg-blue-100 border-blue-300 text-blue-700' },
        { role: 'Supervisor', email: 'supervisor@powerlink.com', password: 'Supervisor@123', color: 'bg-green-100 border-green-300 text-green-700' },
        { role: 'Technician', email: 'technician@powerlink.com', password: 'Technician@123', color: 'bg-orange-100 border-orange-300 text-orange-700' }
    ];

    const fillCredentials = (email, password) => {
        setLoginData({ email, password });
        setErrors({});
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Client-side validation
            const newErrors = {};

            if (!loginData.password) newErrors.password = 'Password required';
            if (!loginData.email) newErrors.email = 'Email required';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            // Call backend authentication API
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.email.toLowerCase(),
                    password: loginData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({
                    general: data.error || 'Invalid email or password'
                });
                setLoading(false);
                return;
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            console.log('Login successful:', data.user);

            // Redirect based on user role
            const userRole = data.user.role;
            const redirects = {
                customer: '/dashboard',
                technician: '/dashboard',
                supervisor: '/dashboard',
                admin: '/dashboard'
            };
            window.location.href = redirects[userRole] || '/dashboard';

        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            setErrors({
                general: 'Connection error. Please check if backend is running.'
            });
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

                {/* Test Credentials - Clickable */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <p className="text-gray-800 text-sm font-bold mb-3 text-center">Quick Login - Test Accounts</p>
                    <div className="grid grid-cols-2 gap-2">
                        {testAccounts.map((account) => (
                            <button
                                key={account.role}
                                type="button"
                                onClick={() => fillCredentials(account.email, account.password)}
                                className={`${account.color} border-2 p-2 rounded-lg text-xs font-semibold hover:scale-105 transition-transform cursor-pointer`}
                            >
                                <div className="font-bold">{account.role}</div>
                                <div className="text-[10px] opacity-75 mt-1">{account.email}</div>
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-600 text-[10px] text-center mt-2">Click any role to auto-fill credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                            <Mail size={14} className="mr-2" /> Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 flex items-center">
                            <Key size={14} className="mr-2" /> Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className={`w-full py-3 text-white rounded-lg font-bold mt-4 shadow-lg transform hover:scale-[1.02] transition-all ${loading ? 'opacity-70 cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Help Links */}
                <div className="mt-6 text-center">
                    <a href="/forgot-password" className="text-blue-600 text-sm font-medium hover:underline block mb-2">Forgot Password?</a>
                    <p className="text-gray-600 text-sm">
                        Don't have an account? <a href="/register" className="text-blue-600 font-bold hover:underline">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
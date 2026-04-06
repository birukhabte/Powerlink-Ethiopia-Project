import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Shield, UserCircle } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [formData, setFormData] = useState({
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/api/users/${user.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const updatedUser = { ...user, ...response.data.user, firstName: response.data.user.first_name, lastName: response.data.user.last_name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Profile Header Background */}
                <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute -bottom-16 left-10">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg shadow-blue-200">
                                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <UserCircle size={80} strokeWidth={1} />
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors border-4 border-white">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-10 px-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                            <div className="flex items-center gap-3 mt-1.5 font-bold text-sm tracking-widest text-blue-600 uppercase italic">
                                <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{user.role}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-400">@{user.username}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'}`}
                        >
                            {isEditing ? 'Cancel Edit' : (
                                <><User size={18} /> Edit Profile</>
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Personal Information</h2>
                            
                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-500 mb-2 block group-focus-within:text-blue-600 transition-colors uppercase tracking-wider">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    disabled={!isEditing}
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner disabled:opacity-75 font-medium text-gray-700"
                                />
                            </div>

                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-500 mb-2 block group-focus-within:text-blue-600 transition-colors uppercase tracking-wider">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    disabled={!isEditing}
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner disabled:opacity-75 font-medium text-gray-700"
                                />
                            </div>

                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-500 mb-2 block group-focus-within:text-blue-600 transition-colors uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        disabled={!isEditing}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner disabled:opacity-75 font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Contact & Details</h2>

                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-500 mb-2 block group-focus-within:text-blue-600 transition-colors uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        disabled={!isEditing}
                                        placeholder="+251-XXX-XXXXXX"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner disabled:opacity-75 font-medium text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-500 mb-2 block group-focus-within:text-blue-600 transition-colors uppercase tracking-wider">Current Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="address"
                                        disabled={!isEditing}
                                        placeholder="Addis Ababa, Ethiopia"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner disabled:opacity-75 font-medium text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                {isEditing && (
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 italic transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                            <Lock className="text-orange-600" size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Account Security</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">Ensure your account is protected. Change your password regularly or enable two-factor authentication.</p>
                    <button className="w-full py-3 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border border-orange-100">
                        Reset Password
                    </button>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 italic transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                            <Shield className="text-green-600" size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Verification Status</h3>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100/50 mb-6 font-bold text-green-700">
                        <span className="text-sm">Account Status:</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="uppercase text-xs tracking-widest">Verified Expert</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest italic font-medium text-center">Last updated 2 days ago</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

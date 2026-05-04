import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera } from 'lucide-react';

const Profile = () => {
    const { darkMode } = useOutletContext() || { darkMode: true };
    const [isEditing, setIsEditing] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('customerProfilePhoto') || null);
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        firstName: user.firstName || 'John',
        lastName: user.lastName || 'Doe',
        email: user.email || 'customer@test.com',
        phone: '+251 911 234 567',
        address: 'Bole, Addis Ababa, Ethiopia',
        bpNumber: user.bpNumber || 'BP002',
        accountStatus: 'Active',
        joinDate: '2023-06-15',
        totalRequests: 12,
        completedRequests: 10,
    });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const photoData = reader.result;
                setProfilePhoto(photoData);
                localStorage.setItem('customerProfilePhoto', photoData);
                setShowPhotoUpload(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setProfilePhoto(null);
        localStorage.removeItem('customerProfilePhoto');
        setShowPhotoUpload(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
        console.log('Profile updated:', formData);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-6`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        My Profile
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Profile Card */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-8 border mb-6`}>
                    {/* Profile Photo Section */}
                    <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-700">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-br from-purple-500 to-cyan-500"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                                        <User size={40} className="text-white" />
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowPhotoUpload(true)}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {formData.firstName} {formData.lastName}
                                </h2>
                                <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                    Customer • {formData.accountStatus}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                    Member since {formData.joinDate}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                                isEditing
                                    ? darkMode
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : darkMode
                                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        >
                            {isEditing ? (
                                <>
                                    <X size={16} /> Cancel
                                </>
                            ) : (
                                <>
                                    <Edit2 size={16} /> Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    {/* Photo Upload Modal */}
                    {showPhotoUpload && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPhotoUpload(false)}>
                            <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 max-w-sm w-full mx-4 border`} onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Update Profile Photo</h3>
                                    <button onClick={() => setShowPhotoUpload(false)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="block">
                                        <div className={`border-2 border-dashed ${darkMode ? 'border-gray-700 hover:border-cyan-400' : 'border-gray-300 hover:border-blue-500'} rounded-lg p-6 text-center cursor-pointer transition`}>
                                            <Camera className={`mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`} size={32} />
                                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Click to upload photo</p>
                                            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>JPG, PNG or GIF (max 2MB)</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </label>

                                    {profilePhoto && (
                                        <button
                                            onClick={removePhoto}
                                            className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
                                        >
                                            Remove Current Photo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Information */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${
                                            isEditing
                                                ? darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                : darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${
                                            isEditing
                                                ? darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                : darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                                        <Mail size={16} /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${
                                            isEditing
                                                ? darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                : darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                                        <Phone size={16} /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${
                                            isEditing
                                                ? darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                : darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                                        <MapPin size={16} /> Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${
                                            isEditing
                                                ? darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                : darkMode
                                                    ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Account Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>BP Number</p>
                                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.bpNumber}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Status</p>
                                    <p className={`text-lg font-bold text-green-500`}>
                                        {formData.accountStatus}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Service Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                        {formData.totalRequests}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        {formData.completedRequests}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSave}
                                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition ${
                                        darkMode
                                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90'
                                    }`}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className={`flex-1 py-3 rounded-lg font-bold transition border ${
                                        darkMode
                                            ? 'border-gray-700 text-gray-300 hover:bg-[#141b2d]'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

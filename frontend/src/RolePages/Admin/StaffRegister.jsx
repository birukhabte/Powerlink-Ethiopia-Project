import React, { useState } from 'react';
import axios from 'axios';
import {
    UserPlus,
    Wrench,
    Shield,
    MapPin,
    Calendar,
    Upload,
    Building,
    Mail,
    Phone,
    Key,
    Briefcase,
    CheckCircle,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const StaffRegister = () => {
    const [step, setStep] = useState(1);
    const [staffType, setStaffType] = useState('technician');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        username: '',
        password: '',
    });

    const departments = ['Field Operations', 'Maintenance', 'Customer Service', 'Technical Support', 'Management'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const [firstName, ...lastParts] = formData.fullName.split(' ');
            const lastName = lastParts.join(' ') || firstName;

            const registrationData = {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                firstName: firstName,
                lastName: lastName,
                role: staffType,
                phone: formData.phone,
                department: formData.department,
                position: formData.position
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/register-staff`, registrationData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSubmitted({
                    employeeId: response.data.user.id,
                    username: response.data.user.username,
                    staffType: staffType === 'technician' ? 'Technician' : 'Supervisor'
                });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.error || 'Failed to register staff member.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
                <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Complete</h2>
                    <p className="text-gray-500 font-medium mb-8">The new staff member has been successfully added to the system.</p>

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 text-left space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Username</span>
                            <span className="font-bold text-gray-900">{submitted.username}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Role</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${staffType === 'technician' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                {submitted.staffType}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setStep(1);
                            setFormData({
                                fullName: '', email: '', phone: '', address: '',
                                department: '', position: '', username: '', password: ''
                            });
                        }}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                        Register Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Staff Acquisition</h1>
                <p className="text-gray-500 font-medium">Onboard new technicians and operations supervisors.</p>
            </div>

            {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                        onClick={() => { setStaffType('technician'); setStep(2); }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group text-left"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Wrench size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Field Technician</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Responsible for outage repairs, meter installations, and maintenance tasks.</p>
                    </button>

                    <button
                        onClick={() => { setStaffType('supervisor'); setStep(2); }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all group text-left"
                    >
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Operations Supervisor</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Oversees task distribution, document validation, and team performance.</p>
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="p-2 hover:bg-white rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                            <h2 className="text-xl font-black text-gray-900">New {staffType.charAt(0).toUpperCase() + staffType.slice(1)} Registration</h2>
                        </div>
                        <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">Step 2 of 2</div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                                <select
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800 appearance-none"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Register Staff Member</>}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StaffRegister;
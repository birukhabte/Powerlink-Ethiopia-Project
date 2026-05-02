import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    UserPlus,
    Wrench,
    Shield,
    MapPin,
    Calendar,
    Upload,
    Tag,
    Building,
    Mail,
    Phone,
    Key,
    Briefcase,
    CheckCircle,
    Clock,
    X
} from 'lucide-react';

const StaffRegister = () => {
    const { darkMode } = useOutletContext();
    const [step, setStep] = useState(1);
    const [staffType, setStaffType] = useState('technician');
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        address: '',

        // Employee Information
        employeeType: 'technician',
        department: '',
        position: '',

        // Work Details
        workZones: [],
        skills: [],
        schedule: {
            start: '08:00',
            end: '17:00',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },

        // Credentials
        username: '',
        temporaryPassword: '',

        // Documents
        documents: []
    });

    const departments = ['Field Operations', 'Maintenance', 'Customer Service', 'Technical Support', 'Management'];

    const workZonesOptions = [
        'Addis Ababa Central', 'Addis Ababa East', 'Addis Ababa West',
        'Bole Area', 'Megenagna', 'Kirkos', 'Gurd Shola',
        'Bahir Dar', 'Hawassa', 'Dire Dawa', 'Mekelle'
    ];

    const skillsOptions = [
        'Transformer Repair', 'Line Maintenance', 'Meter Installation',
        'GIS Mapping', 'Emergency Response', 'Customer Service',
        'Technical Training', 'Safety Inspection', 'Equipment Testing'
    ];

    const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate employee ID
        const prefix = staffType === 'technician' ? 'TECH' : 'SUP';
        const randomNum = Math.floor(100 + Math.random() * 900);
        const employeeId = `${prefix}-${randomNum}`;

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Update form data with generated credentials
        const finalData = {
            ...formData,
            employeeId,
            temporaryPassword: tempPassword,
            status: 'pending'
        };

        console.log('Staff registered:', finalData);

        // Show success message
        setSubmitted({
            employeeId,
            temporaryPassword: tempPassword,
            staffType: staffType === 'technician' ? 'Technician' : 'Supervisor'
        });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            documents: [...formData.documents, ...files]
        });
    };

    const toggleZone = (zone) => {
        const zones = formData.workZones.includes(zone)
            ? formData.workZones.filter(z => z !== zone)
            : [...formData.workZones, zone];
        setFormData({ ...formData, workZones: zones });
    };

    const toggleSkill = (skill) => {
        const skills = formData.skills.includes(skill)
            ? formData.skills.filter(s => s !== skill)
            : [...formData.skills, skill];
        setFormData({ ...formData, skills: skills });
    };

    const toggleDay = (day) => {
        const days = formData.schedule.days.includes(day)
            ? formData.schedule.days.filter(d => d !== day)
            : [...formData.schedule.days, day];
        setFormData({
            ...formData,
            schedule: { ...formData.schedule, days }
        });
    };

    if (submitted) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} flex items-center justify-center p-6`}>
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-xl'} rounded-2xl p-8 max-w-md text-center border`}>
                    <CheckCircle className={`mx-auto ${darkMode ? 'text-green-400' : 'text-green-600'} mb-4`} size={64} />
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Staff Registered Successfully!</h2>

                    <div className={`${darkMode ? 'bg-[#141b2d] border-gray-700' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg mb-6 border`}>
                        <div className="text-left space-y-3">
                            <div className="flex justify-between">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-700'}>Employee ID:</span>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{submitted.employeeId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-700'}>Role:</span>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{submitted.staffType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-700'}>Temporary Password:</span>
                                <span className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{submitted.temporaryPassword}</span>
                            </div>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Credentials have been sent to {formData.email}</p>
                    </div>

                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setStep(1);
                            setFormData({
                                fullName: '', email: '', phone: '', address: '',
                                employeeType: 'technician', department: '', position: '',
                                workZones: [], skills: [], schedule: { start: '08:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
                                username: '', temporaryPassword: '', documents: []
                            });
                        }}
                        className={`w-full py-3 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white rounded-lg hover:opacity-90 transition shadow-lg`}
                    >
                        Register Another Staff
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} p-4 md:p-6`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <UserPlus className={`mx-auto ${darkMode ? 'text-cyan-400' : 'text-blue-600'} mb-4`} size={48} />
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Register Staff Member</h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Add new technicians and supervisors to the system</p>
                </div>

                {/* Staff Type Selection */}
                <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-xl p-6 mb-6 border`}>
                    <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Staff Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setStaffType('technician');
                                setFormData({ ...formData, employeeType: 'technician' });
                                setStep(2);
                            }}
                            className={`p-6 border-2 rounded-xl flex flex-col items-center transition ${
                                staffType === 'technician' 
                                    ? darkMode 
                                        ? 'border-cyan-400 bg-cyan-400/10' 
                                        : 'border-blue-500 bg-blue-50'
                                    : darkMode
                                        ? 'border-gray-700 hover:border-cyan-400/50'
                                        : 'border-gray-300 hover:border-blue-400'
                            }`}
                        >
                            <Wrench className={`mb-3 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} size={32} />
                            <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Technician</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Field operations & repairs</div>
                        </button>

                        <button
                            onClick={() => {
                                setStaffType('supervisor');
                                setFormData({ ...formData, employeeType: 'supervisor' });
                                setStep(2);
                            }}
                            className={`p-6 border-2 rounded-xl flex flex-col items-center transition ${
                                staffType === 'supervisor' 
                                    ? darkMode 
                                        ? 'border-purple-400 bg-purple-400/10' 
                                        : 'border-purple-500 bg-purple-50'
                                    : darkMode
                                        ? 'border-gray-700 hover:border-purple-400/50'
                                        : 'border-gray-300 hover:border-purple-400'
                            }`}
                        >
                            <Shield className={`mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
                            <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Supervisor</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Team management & oversight</div>
                        </button>
                    </div>
                </div>

                {/* Registration Form */}
                {step === 2 && (
                    <div className={`${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200 shadow-md'} rounded-xl p-6 border`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Register New {staffType === 'technician' ? 'Technician' : 'Supervisor'}
                            </h2>
                            <button onClick={() => setStep(1)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <UserPlus className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Personal Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className={`col-span-2 p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Department & Position */}
                            <div>
                                <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <Building className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Employment Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Position Title"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Work Zones */}
                            <div>
                                <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <MapPin className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Work Zones
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {workZonesOptions.map(zone => (
                                        <button
                                            key={zone}
                                            type="button"
                                            onClick={() => toggleZone(zone)}
                                            className={`px-3 py-2 rounded-lg border ${
                                                formData.workZones.includes(zone) 
                                                    ? darkMode 
                                                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' 
                                                        : 'bg-blue-100 border-blue-500 text-blue-700'
                                                    : darkMode
                                                        ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                        : 'bg-gray-100 border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {zone}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Skills (Technician only) */}
                            {staffType === 'technician' && (
                                <div>
                                    <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <Briefcase className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsOptions.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-3 py-2 rounded-lg border ${
                                                    formData.skills.includes(skill) 
                                                        ? darkMode 
                                                            ? 'bg-green-400/20 border-green-400 text-green-400' 
                                                            : 'bg-green-100 border-green-500 text-green-700'
                                                        : darkMode
                                                            ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                            : 'bg-gray-100 border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Work Schedule */}
                            <div>
                                <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <Calendar className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Work Schedule
                                </h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="time"
                                        value={formData.schedule.start}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            schedule: { ...formData.schedule, start: e.target.value }
                                        })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    />
                                    <input
                                        type="time"
                                        value={formData.schedule.end}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            schedule: { ...formData.schedule, end: e.target.value }
                                        })}
                                        className={`p-3 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-cyan-400' : 'focus:ring-blue-500'}`}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {daysOptions.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`px-3 py-2 rounded-lg border ${
                                                formData.schedule.days.includes(day) 
                                                    ? darkMode 
                                                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' 
                                                        : 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                                    : darkMode
                                                        ? 'bg-[#141b2d] border-gray-700 text-gray-400'
                                                        : 'bg-gray-100 border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div>
                                <h3 className={`font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <Upload className={`mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} /> Required Documents
                                </h3>
                                <div className={`border-2 border-dashed ${darkMode ? 'border-gray-700 bg-[#141b2d]' : 'border-gray-300 bg-gray-50'} rounded-lg p-6 text-center`}>
                                    <Upload className={`mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`} />
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Upload ID, certificates, and other documents</p>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className={`block mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full py-3 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white rounded-lg hover:opacity-90 transition font-bold text-lg shadow-lg`}
                            >
                                <UserPlus className="inline mr-2" /> Complete Registration
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffRegister;
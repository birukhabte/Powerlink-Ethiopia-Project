import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    User,
    DollarSign,
    Wrench,
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Send,
    X,
    Zap,
    MapPin,
    Navigation,
    Target
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const RequestService = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: '',
        fullName: '',
        city: 'Addis Ababa',
        woreda: '',
        kebele: '',
        housePlotNumber: '',
        nearbyLandmark: '',
        phone: '',
        latitude: null,
        longitude: null,
        documents: [],
        idCopy: null,
        propertyProof: null,
        sitePlan: null,
        buildingPermit: null
    });

    const services = [
        { id: 'new-service', icon: <Zap />, label: 'New Service', description: 'Request new electricity connection' },
        { id: 'relocation', icon: <Home />, label: 'Service Relocation', description: 'Move service to new address' },
        { id: 'name-change', icon: <User />, label: 'Name Change', description: 'Change account ownership' },
        { id: 'tariff-change', icon: <DollarSign />, label: 'Tariff Change', description: 'Modify billing plan' },
        { id: 'meter-separation', icon: <Wrench />, label: 'Meter Separation', description: 'Separate meter connections' }
    ];

    const requiredDocuments = {
        'new-service': ['ID Copy', 'Proof of Property Ownership/Lease', 'Site Plan', 'Building Permit'],
        relocation: ['ID Copy', 'Proof of Address', 'Previous Bill'],
        'name-change': ['ID Copy', 'Legal Document', 'Authorization Letter'],
        'tariff-change': ['ID Copy', 'Application Form'],
        'meter-separation': ['ID Copy', 'Property Deed', 'Electrical Plan']
    };

    const [generatedTicketId, setGeneratedTicketId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please update your browser or use a different device.');
            return;
        }

        // Check if we're in a secure context (HTTPS) - allow localhost for development
        if (window.location.protocol !== 'https:' &&
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1') {
            alert('Location services work best with a secure connection (HTTPS). For development, localhost is allowed. If you\'re having issues, try enabling location permissions in your browser.');
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setGettingLocation(false);
                alert('Location captured successfully!');
            },
            (error) => {
                console.error('Error getting location:', error);
                setGettingLocation(false);

                // Provide specific error messages based on error code
                let errorMessage = 'Could not capture location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location permissions in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. Please check that location services are enabled on your device.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please try again or enter coordinates manually.';
                        break;
                }

                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000, // 15 seconds timeout
                maximumAge: 60000 // Accept cached position up to 1 minute old
            }
        );
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, documents: [...formData.documents, ...files] });
    };

    const handleSeparateFileUpload = (fieldName, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [fieldName]: file });
        }
    };

    const removeSeparateFile = (fieldName) => {
        setFormData({ ...formData, [fieldName]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.woreda) newErrors.woreda = 'Woreda is required';
        if (!formData.kebele) newErrors.kebele = 'Kebele is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';

        if (selectedService === 'new-service') {
            if (!formData.idCopy) newErrors.idCopy = 'ID Copy is required';
            if (!formData.propertyProof) newErrors.propertyProof = 'Property Proof is required';
            if (!formData.sitePlan) newErrors.sitePlan = 'Site Plan is required';
            if (!formData.buildingPermit) newErrors.buildingPermit = 'Building Permit is required';
        } else {
            if (formData.documents.length === 0) {
                newErrors.documents = 'Please upload the required document';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);

        try {
            const ticketId = `SRV-2024-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
            setGeneratedTicketId(ticketId);

            // 1. Upload files
            const uploadFormData = new FormData();
            uploadFormData.append('ticketId', ticketId);
            
            if (selectedService === 'new-service') {
                if (formData.idCopy) uploadFormData.append('idCopy', formData.idCopy);
                if (formData.propertyProof) uploadFormData.append('propertyProof', formData.propertyProof);
                if (formData.sitePlan) uploadFormData.append('sitePlan', formData.sitePlan);
                if (formData.buildingPermit) uploadFormData.append('buildingPermit', formData.buildingPermit);
            } else {
                formData.documents.forEach((file) => {
                    uploadFormData.append('documents', file);
                });
            }

            const uploadResponse = await fetch(API_ENDPOINTS.uploads.serviceDocuments, {
                method: 'POST',
                body: uploadFormData
            });

            const uploadData = await uploadResponse.json();
            if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

            const addressParts = [];
            if (formData.housePlotNumber) addressParts.push(`H/P: ${formData.housePlotNumber}`);
            addressParts.push(`Keb: ${formData.kebele}, Wor: ${formData.woreda}, ${formData.city}`);
            if (formData.nearbyLandmark) addressParts.push(`Landmark: ${formData.nearbyLandmark}`);
            const fullAddress = addressParts.join(', ');

            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = user?.id || null;

            // 2. Submit Request
            const requestData = {
                ticketId: ticketId,
                serviceType: selectedService,
                fullName: formData.fullName,
                phone: formData.phone,
                city: formData.city,
                woreda: formData.woreda,
                kebele: formData.kebele,
                housePlotNumber: formData.housePlotNumber || null,
                nearbyLandmark: formData.nearbyLandmark || null,
                fullAddress: fullAddress,
                latitude: formData.latitude,
                longitude: formData.longitude,
                documents: uploadData.documents,
                createdBy: userId
            };

            const response = await fetch(API_ENDPOINTS.serviceRequests.base, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setErrors({ submit: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl max-w-md mx-auto text-center border border-slate-100">
                <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-emerald-500" size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Request Filed!</h2>
                <p className="text-slate-500 font-bold text-lg mb-8">TICKET: {generatedTicketId}</p>
                <div className="w-full space-y-4">
                    <button onClick={() => navigate('/ticket')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        TRACK PROGRESS
                    </button>
                    <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        FILE ANOTHER
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-0">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">SERVICE APPLICATIONS</h1>
                <p className="text-slate-500 font-medium">Select a service and provide the required information</p>
            </header>

            {/* Steps Visualizer */}
            <div className="flex items-center gap-4 mb-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                        {s < 3 && <div className={`w-12 h-1 bg-slate-200 rounded-full ${step > s ? 'bg-blue-600' : ''}`}></div>}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                    {services.map((s) => (
                        <div key={s.id} onClick={() => { setSelectedService(s.id); setFormData(f => ({ ...f, serviceType: s.id })); setStep(2); }} className="bg-white p-6 rounded-3xl border-2 border-transparent shadow-sm hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {s.icon}
                            </div>
                            <h3 className="font-black text-slate-900 mb-1 uppercase tracking-tighter">{s.label}</h3>
                            <p className="text-slate-500 text-xs font-medium">{s.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                        <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">
                            {services.find(s => s.id === selectedService)?.label} Application
                        </h2>
                        <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Identity */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Customer Full Name</label>
                                <div className="relative">
                                    <input type="text" value={formData.fullName} onChange={(e) => setFormData(f => ({ ...f, fullName: e.target.value }))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all pl-12" placeholder="As shown on ID" />
                                    <User className="absolute left-4 top-4 text-slate-400" size={18} />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.fullName}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Phone Number</label>
                                <div className="relative">
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all pl-12" placeholder="0912345678" />
                                    <Zap className="absolute left-4 top-4 text-slate-400" size={18} />
                                </div>
                                {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Section: Location */}
                        <div className="bg-slate-50 p-6 rounded-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-600" /> SERVICE LOCATION
                                </h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${gettingLocation ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'}`}>
                                        {gettingLocation ? 'ACQUIRING GPS...' : <><Navigation size={14} /> AUTO-CAPTURE LOCATION</>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const lat = prompt('Enter latitude (e.g., 9.1450):');
                                            const lng = prompt('Enter longitude (e.g., 38.7521):');
                                            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    latitude: parseFloat(lat),
                                                    longitude: parseFloat(lng)
                                                }));
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        <Target size={14} /> MANUAL ENTRY
                                    </button>
                                </div>
                            </div>

                            {formData.latitude && (
                                <div className="mb-6 flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-[10px] font-black uppercase">
                                    <Target size={14} /> GPS COORDINATES CAPTURED: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">CITY</label>
                                    <input type="text" value={formData.city} disabled className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">WOREDA *</label>
                                    <input type="text" value={formData.woreda} onChange={(e) => setFormData(f => ({ ...f, woreda: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">KEBELE *</label>
                                    <input type="text" value={formData.kebele} onChange={(e) => setFormData(f => ({ ...f, kebele: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 mb-1">H/P NUMBER</label>
                                    <input type="text" value={formData.housePlotNumber} onChange={(e) => setFormData(f => ({ ...f, housePlotNumber: e.target.value }))} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Documents */}
                        <div>
                            <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                <FileText size={18} className="text-blue-600" /> SUPPORTING DOCUMENTATION
                            </h3>
                            {selectedService === 'new-service' ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['idCopy', 'propertyProof', 'sitePlan', 'buildingPermit'].map((field) => (
                                        <div key={field} className="relative group">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                                                {field.replace(/([A-Z])/g, ' $1')} *
                                            </label>
                                            <div className={`p-4 border-2 border-dashed rounded-2xl transition-all ${formData[field] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-blue-400'}`}>
                                                <input type="file" onChange={(e) => handleSeparateFileUpload(field, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap pr-6">
                                                        {formData[field] ? formData[field].name : 'Drop file or click'}
                                                    </span>
                                                    {formData[field] ? <CheckCircle className="text-emerald-500" size={16} /> : <Upload className="text-slate-300" size={16} />}
                                                </div>
                                            </div>
                                            {errors[field] && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors[field]}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative p-12 border-4 border-dashed border-slate-100 rounded-3xl text-center hover:border-blue-200 transition-all bg-slate-50/50">
                                    <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <Upload className="mx-auto text-slate-300 mb-4" size={40} />
                                    <p className="text-slate-600 font-bold mb-2">Drag and drop required files</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {requiredDocuments[selectedService]?.map(d => (
                                            <span key={d} className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-400 border border-slate-100">{d.toUpperCase()}</span>
                                        ))}
                                    </div>
                                    {formData.documents.length > 0 && (
                                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                            {formData.documents.map((f, i) => (
                                                <span key={i} className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black">{f.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={submitting} className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${submitting ? 'bg-slate-100 text-slate-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 active:scale-95'}`}>
                            {submitting ? 'PROCESSING APPLICATION...' : <><Send size={24} /> FILE OFFICIAL REQUEST</>}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RequestService;

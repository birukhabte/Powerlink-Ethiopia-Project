import React, { useState } from 'react';
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
    Zap
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

const RequestService = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: '',
        fullName: '',
        city: 'Addis Ababa',
        woreda: '',
        kebele: '',
        housePlotNumber: '',
        nearbyLandmark: '',
        phone: '',
        documents: [],
        // Separate document fields for new-service
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
        'new-service': ['Combined Document (ID Copy, Proof of Property Ownership/Lease, Site Plan, Building Permit)'],
        relocation: ['ID Copy', 'Proof of Address', 'Previous Bill'],
        'name-change': ['ID Copy', 'Legal Document', 'Authorization Letter'],
        'tariff-change': ['ID Copy', 'Application Form'],
        'meter-separation': ['ID Copy', 'Property Deed', 'Electrical Plan']
    };

    const [generatedTicketId, setGeneratedTicketId] = useState('');

    const [submitting, setSubmitting] = useState(false);

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

        // Validate required fields
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.woreda) newErrors.woreda = 'Woreda is required';
        if (!formData.kebele) newErrors.kebele = 'Kebele is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';

        // Validate that document is uploaded
        if (selectedService === 'new-service') {
            // For new service, check separate documents
            if (!formData.idCopy) newErrors.idCopy = 'ID Copy is required';
            if (!formData.propertyProof) newErrors.propertyProof = 'Property Proof is required';
            if (!formData.sitePlan) newErrors.sitePlan = 'Site Plan is required';
            if (!formData.buildingPermit) newErrors.buildingPermit = 'Building Permit is required';
        } else {
            // For other services, check combined documents
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

            // Step 1: Upload files to server
            const uploadFormData = new FormData();
            uploadFormData.append('ticketId', ticketId);
            
            if (selectedService === 'new-service') {
                // Upload separate documents with specific field names
                if (formData.idCopy) uploadFormData.append('idCopy', formData.idCopy);
                if (formData.propertyProof) uploadFormData.append('propertyProof', formData.propertyProof);
                if (formData.sitePlan) uploadFormData.append('sitePlan', formData.sitePlan);
                if (formData.buildingPermit) uploadFormData.append('buildingPermit', formData.buildingPermit);
            } else {
                // Upload combined documents
                formData.documents.forEach((file) => {
                    uploadFormData.append('documents', file);
                });
            }

            const uploadResponse = await fetch(API_ENDPOINTS.uploads.serviceDocuments, {
                method: 'POST',
                body: uploadFormData
            });

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error(uploadData.error || 'Failed to upload documents');
            }

            // Use the uploaded document metadata with file paths
            const documentMetadata = uploadData.documents;

            const addressParts = [];
            if (formData.housePlotNumber) addressParts.push(`House/Plot: ${formData.housePlotNumber}`);
            addressParts.push(`Kebele: ${formData.kebele}`);
            addressParts.push(`Woreda: ${formData.woreda}`);
            addressParts.push(`City: ${formData.city}`);
            if (formData.nearbyLandmark) addressParts.push(`Landmark: ${formData.nearbyLandmark}`);
            const fullAddress = addressParts.join(', ');


            // Get user from localStorage if available
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = user?.id || null;

            console.log('=== SERVICE REQUEST SUBMISSION DEBUG ===');
            console.log('User from localStorage:', user);
            console.log('User ID:', userId);

            // Step 2: Prepare request data with document paths - using camelCase to match backend API
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
                documents: documentMetadata,
                createdBy: userId
            };

            console.log('Request data being sent:', requestData);

            // Step 3: Send service request to backend API
            const response = await fetch(API_ENDPOINTS.serviceRequests.base, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Backend response:', data);

            if (data.success) {
                console.log('✅ Service request submitted successfully!');
                console.log('Ticket ID:', ticketId);
                console.log('Created by user ID:', userId);
                console.log('Request will be visible in Track Ticket page');

                setSubmitted(true);
                setErrors({});
            } else {
                throw new Error(data.error || 'Failed to submit request');
            }
        } catch (error) {
            console.error('❌ Error submitting service request:', error);
            setErrors({ submit: error.message || 'Failed to submit request. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };


    if (submitted) {
        return (
            <div className="flex items-center justify-center p-6 bg-white min-h-[60vh] rounded-2xl">
                <div className="max-w-md text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4 animate-bounce" size={64} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
                    <p className="text-gray-600 mb-4 font-semibold text-lg">Ticket #{generatedTicketId}</p>
                    <div className="bg-blue-50 p-6 rounded-xl mb-6 text-left border border-blue-100">
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-blue-600" /> Ticket saved to your account</li>
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-blue-600" /> Sent to supervisor for validation</li>
                            <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-blue-600" /> You can track status updates anytime</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => navigate('/ticket')}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                        Track Your Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Service</h1>
                <p className="text-gray-600">Select and request additional services</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between mb-8 max-w-2xl">
                <div className={`text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2 border-blue-600">1</div>
                    <div className="font-medium">Select Service</div>
                </div>
                <div className={`text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2">2</div>
                    <div className="font-medium">Fill Form</div>
                </div>
                <div className={`text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center mb-2">3</div>
                    <div className="font-medium">Submit</div>
                </div>
            </div>

            {/* Step 1: Select Service */}
            {step === 1 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-6">Choose a Service</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service.id);
                                    setFormData({ ...formData, serviceType: service.id });
                                    setStep(2);
                                }}
                                className={`p-6 border-2 rounded-xl cursor-pointer transition ${selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                                        {service.icon}
                                    </div>
                                    <div className="font-bold text-gray-800">{service.label}</div>
                                </div>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Service Form */}
            {step === 2 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">
                            {services.find(s => s.id === selectedService)?.label} Request
                        </h2>
                        <button onClick={() => setStep(1)} className="text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block mb-2 font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Your full name"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Address Fields */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Address Information *</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium">City *</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            disabled
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Woreda *</label>
                                        <input
                                            type="text"
                                            value={formData.woreda}
                                            onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="Woreda name"
                                        />
                                        {errors.woreda && <p className="text-red-500 text-sm mt-1">{errors.woreda}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Kebele *</label>
                                        <input
                                            type="text"
                                            value={formData.kebele}
                                            onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="Kebele number or name"
                                        />
                                        {errors.kebele && <p className="text-red-500 text-sm mt-1">{errors.kebele}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">House Number or Plot Number</label>
                                        <input
                                            type="text"
                                            value={formData.housePlotNumber}
                                            onChange={(e) => setFormData({ ...formData, housePlotNumber: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="House/Plot number (optional)"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block mb-2 font-medium">Nearby Landmark</label>
                                    <input
                                        type="text"
                                        value={formData.nearbyLandmark}
                                        onChange={(e) => setFormData({ ...formData, nearbyLandmark: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="e.g., Near Bole Medhanealem Church, Next to ABC School (optional)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="0912345678"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                        </div>

                        {/* Document Upload */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <FileText className="text-blue-600 mr-2" />
                                <h3 className="font-bold">Required Documents</h3>
                            </div>

                            {selectedService === 'new-service' ? (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                                        <p className="text-sm text-blue-800 font-medium">
                                            For <strong>{services.find(s => s.id === selectedService)?.label}</strong>, please upload each document separately:
                                        </p>
                                    </div>

                                    {/* ID Copy */}
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">1. ID Copy *</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleSeparateFileUpload('idCopy', e)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    />
                                                </div>
                                                {formData.idCopy && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSeparateFile('idCopy')}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                            {formData.idCopy && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center">
                                                    <CheckCircle size={16} className="mr-1" /> {formData.idCopy.name}
                                                </p>
                                            )}
                                        </div>
                                        {errors.idCopy && <p className="text-red-500 text-sm mt-1">{errors.idCopy}</p>}
                                    </div>

                                    {/* Property Proof */}
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">2. Proof of Property Ownership/Lease *</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleSeparateFileUpload('propertyProof', e)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    />
                                                </div>
                                                {formData.propertyProof && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSeparateFile('propertyProof')}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                            {formData.propertyProof && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center">
                                                    <CheckCircle size={16} className="mr-1" /> {formData.propertyProof.name}
                                                </p>
                                            )}
                                        </div>
                                        {errors.propertyProof && <p className="text-red-500 text-sm mt-1">{errors.propertyProof}</p>}
                                    </div>

                                    {/* Site Plan */}
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">3. Site Plan *</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleSeparateFileUpload('sitePlan', e)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    />
                                                </div>
                                                {formData.sitePlan && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSeparateFile('sitePlan')}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                            {formData.sitePlan && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center">
                                                    <CheckCircle size={16} className="mr-1" /> {formData.sitePlan.name}
                                                </p>
                                            )}
                                        </div>
                                        {errors.sitePlan && <p className="text-red-500 text-sm mt-1">{errors.sitePlan}</p>}
                                    </div>

                                    {/* Building Permit */}
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">4. Building Permit *</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleSeparateFileUpload('buildingPermit', e)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    />
                                                </div>
                                                {formData.buildingPermit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSeparateFile('buildingPermit')}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                            </div>
                                            {formData.buildingPermit && (
                                                <p className="text-sm text-green-600 mt-2 flex items-center">
                                                    <CheckCircle size={16} className="mr-1" /> {formData.buildingPermit.name}
                                                </p>
                                            )}
                                        </div>
                                        {errors.buildingPermit && <p className="text-red-500 text-sm mt-1">{errors.buildingPermit}</p>}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="text-sm text-gray-700 mb-2">
                                            For <strong>{services.find(s => s.id === selectedService)?.label}</strong>, please upload:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm text-gray-600">
                                            {requiredDocuments[selectedService]?.map((doc, idx) => (
                                                <li key={idx}>{doc}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                        <p className="text-gray-600 mb-2">Upload required documents</p>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        {errors.documents && (
                                            <p className="text-red-500 text-sm mt-2">{errors.documents}</p>
                                        )}
                                    </div>

                                    {formData.documents.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">Uploaded files:</p>
                                            {formData.documents.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                                                    <span className="text-sm">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newDocs = [...formData.documents];
                                                            newDocs.splice(idx, 1);
                                                            setFormData({ ...formData, documents: newDocs });
                                                        }}
                                                        className="text-red-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Error Message */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-center">
                                <AlertCircle className="text-red-500 mr-3" />
                                <span className="text-red-600">
                                    {errors.submit || 'Please fix the errors above before submitting.'}
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2" /> Submit Request
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RequestService;

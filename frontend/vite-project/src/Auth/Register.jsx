import { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const Registration = () => {
    const [step, setStep] = useState(0); // Start at 0 for BP number question
    const [hasBPNumber, setHasBPNumber] = useState(null);
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        bpNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        
        // Step 2: Address & Location
        city: '',
        woreda: '',
        kebele: '',
        housePlotNumber: '',
        nearbyLandmark: '',
        
        // Step 3: Business Info (conditional)
        accountType: 'individual',
        organizationName: '',
        organizationType: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const validateStep1 = () => {
        const newErrors = {};
        
        // BP Number is only required if user said they have one
        if (hasBPNumber && !formData.bpNumber) newErrors.bpNumber = 'BP Number required';
        
        if (!formData.firstName) newErrors.firstName = 'First name required';
        if (!formData.lastName) newErrors.lastName = 'Last name required';
        if (!formData.email) newErrors.email = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone) newErrors.phone = 'Phone number required';
        if (!formData.password) newErrors.password = 'Password required';
        else if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        
        if (!formData.city) newErrors.city = 'City required';
        if (!formData.woreda) newErrors.woreda = 'Woreda required';
        if (!formData.kebele) newErrors.kebele = 'Kebele required';
        else if (!/^\d{1,3}$/.test(formData.kebele)) newErrors.kebele = 'Kebele must be 1-3 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        
        if (formData.accountType === 'business') {
            if (!formData.organizationName) newErrors.organizationName = 'Organization name required';
            if (!formData.organizationType) newErrors.organizationType = 'Organization type required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setErrors({});
        } else if (step === 2 && validateStep2()) {
            setStep(3);
            setErrors({});
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep3()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.toLowerCase(),
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    userType: 'customer',
                    bpNumber: formData.bpNumber,
                    city: formData.city,
                    woreda: formData.woreda,
                    kebele: formData.kebele,
                    housePlotNumber: formData.housePlotNumber,
                    nearbyLandmark: formData.nearbyLandmark,
                    accountType: formData.accountType,
                    organizationName: formData.organizationName,
                    organizationType: formData.organizationType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({
                    general: data.error || 'Registration failed. Please try again.',
                    details: data.details || ''
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">

                {submitted ? (
                    <div className="text-center py-6">
                        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
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
                        {/* Header */}
                        <div className="text-center mb-8">
                            <UserPlus className="mx-auto text-blue-600 mb-3" size={48} />
                            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                            <p className="text-gray-600">Join PowerLink Ethiopia</p>
                        </div>

                        {/* Progress Steps */}
                        {step > 0 && (
                            <div className="flex justify-between mb-8">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex-1">
                                        <div className={`h-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                        <p className={`text-xs mt-2 text-center ${s <= step ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                                            {s === 1 ? 'Basic Info' : s === 2 ? 'Address & Location' : 'Account Type'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Step 0: BP Number Question */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <div className="text-6xl mb-4">🔑</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Do you have a BP Number?</h3>
                                        <p className="text-gray-600">BP Number is your Business Partner number in the EEU system</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHasBPNumber(true);
                                                setStep(1);
                                            }}
                                            className="p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="text-center">
                                                <div className="text-5xl mb-3">✅</div>
                                                <div className="font-bold text-xl text-gray-800 mb-2">Yes, I have</div>
                                                <div className="text-sm text-gray-600">Continue with BP Number</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setHasBPNumber(false);
                                                setFormData({ ...formData, bpNumber: '' }); // Clear BP number
                                                setStep(1);
                                            }}
                                            className="p-8 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="text-center">
                                                <div className="text-5xl mb-3">📧</div>
                                                <div className="font-bold text-xl text-gray-800 mb-2">No, I don't</div>
                                                <div className="text-sm text-gray-600">Continue with Email</div>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>What is a BP Number?</strong><br/>
                                            A BP (Business Partner) Number is a unique identifier assigned by Ethiopian Electric Utility (EEU) to existing customers. If you're a new customer, select "No, I don't" to register with your email.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* Step 1: Basic Information */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h3>

                                    {/* BP Number - Conditionally Required */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            BP Number {hasBPNumber && <span className="text-red-500">*</span>}
                                            {!hasBPNumber && <span className="text-gray-400 text-xs">(Optional)</span>}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={hasBPNumber ? "Enter BP Number" : "Enter BP Number (optional)"}
                                            value={formData.bpNumber}
                                            onChange={(e) => setFormData({ ...formData, bpNumber: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={!hasBPNumber}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {hasBPNumber ? 'Must be valid in EEU system' : 'You can add this later if needed'}
                                        </p>
                                        {errors.bpNumber && <p className="text-red-500 text-xs mt-1">{errors.bpNumber}</p>}
                                    </div>

                                    {/* First Name & Last Name */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="First name"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Last name"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">For notifications</p>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+251911234567"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">For SMS updates</p>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Minimum 8 characters"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum security requirements</p>
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(0)}
                                            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                                        >
                                            Next: Address & Location
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Address & Location */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Address & Location</h3>

                                    {/* City */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Addis Ababa"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>

                                    {/* Woreda and Kebele */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Woreda <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Bole, 4 Kilo, 6 Kilo"
                                                value={formData.woreda}
                                                onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.woreda && <p className="text-red-500 text-xs mt-1">{errors.woreda}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Kebele <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 03, 07, 12"
                                                value={formData.kebele}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Only allow digits and max 3 characters
                                                    if (/^\d{0,3}$/.test(value)) {
                                                        setFormData({ ...formData, kebele: value });
                                                    }
                                                }}
                                                maxLength={3}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Max 3 digits</p>
                                            {errors.kebele && <p className="text-red-500 text-xs mt-1">{errors.kebele}</p>}
                                        </div>
                                    </div>

                                    {/* House/Plot Number - Optional */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            House/Plot Number <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., H.No. 123, Plot 456"
                                            value={formData.housePlotNumber}
                                            onChange={(e) => setFormData({ ...formData, housePlotNumber: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Nearby Landmark */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">
                                            Nearby Landmark <span className="text-gray-400 text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Near Bole Medhanialem Church"
                                            value={formData.nearbyLandmark}
                                            onChange={(e) => setFormData({ ...formData, nearbyLandmark: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Helps us locate you easily</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
                                        >
                                            Next: Account Type
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Account Type */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Account Type</h3>

                                    {/* Account Type */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Select Account Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, accountType: 'individual' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    formData.accountType === 'individual'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <div className="text-3xl mb-2">👤</div>
                                                    <div className="font-bold text-gray-800">Individual</div>
                                                    <div className="text-xs text-gray-600 mt-1">Personal account</div>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, accountType: 'business' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    formData.accountType === 'business'
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <div className="text-3xl mb-2">🏢</div>
                                                    <div className="font-bold text-gray-800">Business</div>
                                                    <div className="text-xs text-gray-600 mt-1">Organization account</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Business Fields (conditional) */}
                                    {formData.accountType === 'business' && (
                                        <>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                                    Organization Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter organization name"
                                                    value={formData.organizationName}
                                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Only for Business</p>
                                                {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                                    Organization Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.organizationType}
                                                    onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="company">Company</option>
                                                    <option value="ngo">NGO</option>
                                                    <option value="government">Government</option>
                                                    <option value="educational">Educational Institution</option>
                                                    <option value="healthcare">Healthcare</option>
                                                    <option value="retail">Retail/Shop</option>
                                                    <option value="manufacturing">Manufacturing</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <p className="text-xs text-gray-500 mt-1">Only for Business</p>
                                                {errors.organizationType && <p className="text-red-500 text-xs mt-1">{errors.organizationType}</p>}
                                            </div>
                                        </>
                                    )}

                                    {/* Error Display */}
                                    {errors.general && (
                                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                            <div className="flex items-start">
                                                <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                                                <div className="flex-1">
                                                    <span className="text-red-600 text-sm font-semibold block">{errors.general}</span>
                                                    {errors.details && (
                                                        <span className="text-red-500 text-xs block mt-1">Details: {errors.details}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 py-3 text-white rounded-lg font-bold shadow-lg ${
                                                loading ? 'opacity-70 cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        <p className="text-center text-gray-600 mt-6 text-sm">
                            Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Registration;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FileText,
    CheckCircle,
    XCircle,
    Eye,
    Download,
    Clock,
    User,
    AlertCircle,
    Filter,
    Search,
    ChevronRight,
    FileCheck,
    Printer
} from 'lucide-react';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const DocValidation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const targetRequestId = location.state?.requestId;

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRejectionReason, setSelectedRejectionReason] = useState('');
    const [customRejectionReason, setCustomRejectionReason] = useState('');
    const [docToReject, setDocToReject] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.serviceRequests.base);
            const data = await response.json();

            if (data.success) {
                // Transform service requests into document entries
                const allDocs = [];
                data.requests.forEach(request => {
                    const requestDocs = request.documents || [];
                    
                    // Group all documents for this request
                    const docGroup = {
                        id: `DOC-${request.ticket_id}`,
                        requestId: request.id,
                        ticketId: request.ticket_id,
                        customer: request.full_name,
                        requestType: formatServiceType(request.service_type),
                        uploaded: calculateTimeAgo(request.created_at),
                        status: request.status === 'pending' || request.status === 'under_review' ? 'pending' : (request.status === 'rejected' ? 'rejected' : 'approved'),
                        documentCount: requestDocs.length,
                        documents: requestDocs.map((docMetadata, index) => ({
                            id: `${request.ticket_id}-${index + 1}`,
                            name: docMetadata.name || docMetadata.originalName || 'Supporting Document',
                            fileName: docMetadata.originalName || docMetadata.name || 'document.pdf',
                            storedName: docMetadata.storedName || docMetadata.name,
                            filePath: docMetadata.path || null,
                            size: formatBytes(docMetadata.size || 0),
                            fileType: docMetadata.type || 'application/pdf',
                            documentType: docMetadata.documentType || 'general',
                            previewUrl: docMetadata.path ? `${API_BASE_URL}${docMetadata.path}` : '#',
                            downloadUrl: docMetadata.storedName ? API_ENDPOINTS.uploads.download(request.ticket_id, docMetadata.storedName) : null,
                        }))
                    };
                    
                    allDocs.push(docGroup);
                });

                setDocuments(allDocs);

                // If coming from "Check Document" button, select the doc group of that request
                if (targetRequestId) {
                    const docGroup = allDocs.find(d => d.requestId === targetRequestId);
                    if (docGroup) {
                        setSelectedDoc(docGroup);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatServiceType = (serviceType) => {
        const serviceMap = {
            'new-service': 'New Service Connection',
            'relocation': 'Service Relocation',
            'name-change': 'Name Change',
            'tariff-change': 'Tariff Change',
            'meter-separation': 'Meter Separation',
            'outage': 'Reported Outage'
        };
        return serviceMap[serviceType] || serviceType;
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    };

    const handleApprove = async (docId) => {
        try {
            // Find the document and its associated request
            const doc = documents.find(d => d.id === docId);
            if (!doc) return;

            // Update the service request status via API
            const response = await fetch(API_ENDPOINTS.serviceRequests.approve(doc.requestId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supervisor_notes: 'Document approved by supervisor'
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setDocuments(docs => docs.map(d =>
                    d.id === docId ? {
                        ...d,
                        status: 'approved',
                        approvedBy: 'You',
                        approvedAt: new Date().toLocaleTimeString()
                    } : d
                ));
                console.log(`Document ${docId} approved and status sent to customer`);
                alert('Document approved successfully! Customer has been notified.');
                // Refresh documents
                fetchDocuments();
            } else {
                throw new Error(data.error || 'Failed to approve document');
            }
        } catch (error) {
            console.error('Error approving document:', error);
            alert('Failed to approve document. Please try again.');
        }
    };

    // Predefined rejection reasons
    const rejectionReasons = [
        {
            category: 'Incomplete Documentation',
            reasons: [
                'Missing required forms or attachments',
                'Application form not fully filled',
                'Required signatures not provided'
            ]
        },
        {
            category: 'Invalid or Expired Identification',
            reasons: [
                'National ID, Kebele ID, or passport is expired',
                'ID does not belong to the applicant',
                'Name on ID does not match the application'
            ]
        },
        {
            category: 'Property Documentation Issues',
            reasons: [
                'Proof of property ownership is missing or invalid',
                'Lease agreement is expired or incomplete',
                'Property documents do not match the application address'
            ]
        },
        {
            category: 'Document Quality Issues',
            reasons: [
                'Document is blurred or unreadable',
                'Document appears to be altered or tampered',
                'Poor scan/photo quality - please resubmit'
            ]
        },
        {
            category: 'Other',
            reasons: [
                'Custom reason (specify below)'
            ]
        }
    ];

    const handleReject = (docId) => {
        setDocToReject(docId);
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        const finalReason = selectedRejectionReason === 'Custom reason (specify below)'
            ? customRejectionReason
            : selectedRejectionReason;

        if (!finalReason || finalReason.trim() === '') {
            alert('Please select or enter a rejection reason');
            return;
        }

        try {
            // Find the document and its associated request
            const doc = documents.find(d => d.id === docToReject);
            if (!doc) return;

            // Update the service request status via API with rejection reason
            const response = await fetch(API_ENDPOINTS.serviceRequests.reject(doc.requestId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supervisor_notes: `Document rejected. Reason: ${finalReason}`
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setDocuments(docs => docs.map(d =>
                    d.id === docToReject ? {
                        ...d,
                        status: 'rejected',
                        reason: finalReason,
                        rejectedBy: 'You',
                        rejectedAt: new Date().toLocaleTimeString()
                    } : d
                ));

                console.log(`Document ${docToReject} rejected: ${finalReason}`);
                alert(`Document rejected successfully!\n\nReason: ${finalReason}\n\nThe customer has been notified.`);

                // Reset modal state
                setShowRejectModal(false);
                setSelectedRejectionReason('');
                setCustomRejectionReason('');
                setDocToReject(null);
                
                // Refresh documents
                fetchDocuments();
            } else {
                throw new Error(data.error || 'Failed to reject document');
            }
        } catch (error) {
            console.error('Error rejecting document:', error);
            alert('Failed to reject document. Please try again.');
        }
    };

    const cancelReject = () => {
        setShowRejectModal(false);
        setSelectedRejectionReason('');
        setCustomRejectionReason('');
        setDocToReject(null);
    };

    // Handle document download
    const handleDownload = (doc) => {
        if (doc.downloadUrl) {
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = doc.downloadUrl;
            link.download = doc.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (doc.previewUrl && doc.previewUrl !== '#') {
            // Fallback to preview URL
            window.open(doc.previewUrl, '_blank');
        } else {
            alert('Document file is not available for download.');
        }
    };

    // Handle document preview in new window
    const handlePreview = (doc) => {
        if (doc.previewUrl && doc.previewUrl !== '#') {
            window.open(doc.previewUrl, '_blank');
        } else {
            alert('Document preview is not available.');
        }
    };

    // Handle document print
    const handlePrint = (doc) => {
        if (doc.previewUrl && doc.previewUrl !== '#') {
            // Open document in new window and print
            const printWindow = window.open(doc.previewUrl, '_blank');
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
            }
        } else {
            alert('Document is not available for printing.');
        }
    };

    const filteredDocs = filter === 'all'
        ? documents
        : documents.filter(doc => doc.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <FileCheck className="mr-3" /> Document Validation
                    </h1>
                    <p className="text-gray-600">Review and validate documents uploaded by users</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Documents List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="border rounded-lg px-3 py-2"
                                    >
                                        <option value="all">All Documents</option>
                                        <option value="pending">Pending Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <span className="text-sm text-gray-600">
                                        {filteredDocs.length} documents
                                    </span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-medium">Loading documents...</p>
                                </div>
                            ) : filteredDocs.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium">No documents found matching the criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredDocs.map(doc => (
                                        <div key={doc.id}
                                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedDoc?.id === doc.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                            onClick={() => setSelectedDoc(doc)}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-bold text-gray-800">{doc.ticketId}</div>
                                                    <div className="text-sm text-gray-600">{doc.documentCount} document{doc.documentCount > 1 ? 's' : ''}</div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                                                    {doc.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <User size={14} className="mr-2" /> {doc.customer}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <FileText size={14} className="mr-2" /> {doc.requestType}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock size={14} className="mr-1" /> {doc.uploaded}
                                                </div>
                                                <ChevronRight size={16} className="text-blue-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {documents.filter(d => d.status === 'pending').length}
                                </div>
                                <div className="text-gray-600">Pending Review</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {documents.filter(d => d.status === 'approved').length}
                                </div>
                                <div className="text-gray-600">Approved</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {documents.filter(d => d.status === 'rejected').length}
                                </div>
                                <div className="text-gray-600">Rejected</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Details & Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                            {selectedDoc ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4">Document Review</h2>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <div className="text-sm text-gray-600">Ticket ID</div>
                                            <div className="font-bold">{selectedDoc.ticketId}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Customer</div>
                                            <div className="font-medium">{selectedDoc.customer}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Request Type</div>
                                            <div className="font-medium">{selectedDoc.requestType}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Uploaded</div>
                                            <div>{selectedDoc.uploaded}</div>
                                        </div>
                                        
                                        {/* Documents List */}
                                        <div>
                                            <div className="text-sm text-gray-600 mb-3 font-semibold">
                                                Submitted Documents ({selectedDoc.documentCount})
                                            </div>
                                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                                {selectedDoc.documents.map((doc, index) => (
                                                    <div key={doc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-gray-800 text-sm mb-1">
                                                                    {index + 1}. {doc.name}
                                                                </div>
                                                                <div className="text-xs text-gray-600">{doc.fileName}</div>
                                                                <div className="text-xs text-gray-500 mt-1">{doc.size}</div>
                                                            </div>
                                                            {doc.downloadUrl || doc.previewUrl !== '#' ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Available</span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">N/A</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <button
                                                                onClick={() => handlePreview(doc)}
                                                                className="flex-1 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center justify-center"
                                                                title="Preview"
                                                            >
                                                                <Eye size={12} className="mr-1" /> View
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(doc)}
                                                                className="flex-1 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center justify-center"
                                                                title="Download"
                                                            >
                                                                <Download size={12} className="mr-1" /> Download
                                                            </button>
                                                            <button
                                                                onClick={() => handlePrint(doc)}
                                                                className="flex-1 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center justify-center"
                                                                title="Print"
                                                            >
                                                                <Printer size={12} className="mr-1" /> Print
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {selectedDoc.status === 'pending' ? (
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleApprove(selectedDoc.id)}
                                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center justify-center"
                                            >
                                                <CheckCircle className="mr-2" /> Approve All Documents
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedDoc.id)}
                                                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold flex items-center justify-center"
                                            >
                                                <XCircle className="mr-2" /> Reject Documents
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-lg ${selectedDoc.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <div className="font-bold mb-2">
                                                {selectedDoc.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                            </div>
                                            {selectedDoc.status === 'approved' ? (
                                                <div className="text-sm">
                                                    By: {selectedDoc.approvedBy}<br />
                                                    At: {selectedDoc.approvedAt}
                                                </div>
                                            ) : (
                                                <div className="text-sm">
                                                    Reason: {selectedDoc.reason}<br />
                                                    By: {selectedDoc.rejectedBy}<br />
                                                    At: {selectedDoc.rejectedAt}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Request</h3>
                                    <p className="text-gray-500">Choose a request from the list to review all submitted documents</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Notes */}
                        <div className="bg-white rounded-xl shadow p-6 mt-6">
                            <h3 className="font-bold mb-4 flex items-center">
                                <AlertCircle className="mr-2" /> Validation Guidelines
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="text-green-500 mr-2 mt-0.5" size={14} />
                                    Check document expiration dates
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="text-green-500 mr-2 mt-0.5" size={14} />
                                    Verify customer information matches
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="text-green-500 mr-2 mt-0.5" size={14} />
                                    Ensure documents are clear and readable
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="text-green-500 mr-2 mt-0.5" size={14} />
                                    Reject blurred or incomplete documents
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <XCircle className="mr-3 text-red-600" />
                                Reject Document
                            </h2>
                            <p className="text-gray-600 mt-2">Select a reason for rejecting this document</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {rejectionReasons.map((category, catIndex) => (
                                <div key={catIndex} className="space-y-3">
                                    <h3 className="font-bold text-gray-800 text-lg mb-3">{category.category}</h3>
                                    {category.reasons.map((reason, reasonIndex) => (
                                        <label
                                            key={reasonIndex}
                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedRejectionReason === reason
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="rejectionReason"
                                                value={reason}
                                                checked={selectedRejectionReason === reason}
                                                onChange={(e) => setSelectedRejectionReason(e.target.value)}
                                                className="mt-1 mr-3 w-4 h-4 text-red-600"
                                            />
                                            <span className="text-gray-700 font-medium">{reason}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}

                            {/* Custom Reason Input */}
                            {selectedRejectionReason === 'Custom reason (specify below)' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter custom rejection reason:
                                    </label>
                                    <textarea
                                        value={customRejectionReason}
                                        onChange={(e) => setCustomRejectionReason(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        rows="4"
                                        placeholder="Please provide a detailed reason for rejection..."
                                    ></textarea>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={cancelReject}
                                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors flex items-center justify-center"
                            >
                                <XCircle className="mr-2" size={20} />
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocValidation;
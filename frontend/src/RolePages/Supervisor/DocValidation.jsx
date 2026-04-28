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
    Printer,
    RefreshCw,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import axios from 'axios';
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
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.serviceRequests.base, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const allDocs = response.data.requests.map(request => {
                    const requestDocs = request.documents || [];
                    return {
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
                });

                setDocuments(allDocs);

                if (targetRequestId) {
                    const docGroup = allDocs.find(d => d.requestId === targetRequestId);
                    if (docGroup) setSelectedDoc(docGroup);
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
            'meter-separation': 'Meter Separation'
        };
        return serviceMap[serviceType] || serviceType;
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
    };

    const calculateTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    const handleApprove = async (docGroup) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(API_ENDPOINTS.serviceRequests.approve(docGroup.requestId), {
                supervisor_notes: 'Documents verified and approved. Moving to assignment phase.'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Request approved! Technician assignment is now enabled.');
                fetchDocuments();
                setSelectedDoc(null);
            }
        } catch (error) {
            console.error('Error approving documents:', error);
            alert('Failed to approve documents');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async () => {
        const finalReason = selectedRejectionReason === 'Custom reason (specify below)'
            ? customRejectionReason
            : selectedRejectionReason;

        if (!finalReason) return alert('Please specify a reason');

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(API_ENDPOINTS.serviceRequests.reject(docToReject.requestId), {
                supervisor_notes: `Documents rejected: ${finalReason}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Request rejected. Customer notified.');
                setShowRejectModal(false);
                fetchDocuments();
                setSelectedDoc(null);
            }
        } catch (error) {
            console.error('Error rejecting documents:', error);
            alert('Failed to reject documents');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredDocs = filter === 'all' ? documents : documents.filter(doc => doc.status === filter);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center">
                        <ShieldCheck className="mr-3 text-blue-600" size={32} /> COMPLIANCE CENTER
                    </h1>
                    <p className="text-slate-500 font-medium">Verify legal and technical documentation for service applications</p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* List Column */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
                            {['all', 'pending', 'approved'].map(f => (
                                <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="py-20 text-center">
                                <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                                <p className="text-[10px] font-black text-slate-400 uppercase">Indexing Archive...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredDocs.map(doc => (
                                    <div key={doc.id} onClick={() => setSelectedDoc(doc)} className={`bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedDoc?.id === doc.id ? 'border-blue-500 shadow-xl ring-4 ring-blue-50' : 'border-transparent shadow-sm hover:border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{doc.ticketId}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-slate-900 leading-tight mb-4">{doc.customer}</h3>
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><FileText size={12} /> {doc.documentCount} FILES</span>
                                            <span className="flex items-center gap-1 text-blue-600">VERIFY <ArrowRight size={12} /></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Review Column */}
                    <div className="lg:col-span-8">
                        {selectedDoc ? (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                                <div className="bg-slate-900 p-8 text-white">
                                    <h2 className="text-2xl font-black mb-2 italic tracking-tighter uppercase">Document Audit</h2>
                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><User size={14} /> {selectedDoc.customer}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> Submitted {selectedDoc.uploaded}</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                                        {selectedDoc.documents.map((file, idx) => (
                                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-blue-500 transition-all">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-slate-900 text-sm truncate uppercase tracking-tighter">{file.name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold">{file.size} • {file.fileType.split('/')[1].toUpperCase()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => window.open(file.previewUrl, '_blank')} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">
                                                        PREVIEW
                                                    </button>
                                                    <button onClick={() => window.open(file.previewUrl, '_blank')} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-all">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedDoc.status === 'pending' && (
                                        <div className="flex flex-col md:flex-row gap-4 border-t border-slate-50 pt-8">
                                            <button onClick={() => { setDocToReject(selectedDoc); setShowRejectModal(true); }} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                                                REJECT APPLICATION
                                            </button>
                                            <button onClick={() => handleApprove(selectedDoc)} disabled={actionLoading} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                                                {actionLoading ? 'PROCESSING...' : 'APPROVE COMPLIANCE'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center">
                                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-6">
                                    <ShieldCheck className="text-slate-200" size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Compliance Queue</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto">Select a document group from the side-panel to begin the verification process.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-red-600 p-8 text-white">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Issue Rejection</h2>
                            <p className="text-red-100 font-medium text-sm">Please select the discrepancy found in documentation</p>
                        </div>
                        <div className="p-8 space-y-4">
                            {['Incomplete Identity Proof', 'Invalid Property Documents', 'Illegible Scan/Photo', 'Unauthorized Application', 'Expired Documents', 'Custom reason (specify below)'].map(r => (
                                <button key={r} onClick={() => setSelectedRejectionReason(r)} className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all ${selectedRejectionReason === r ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}>
                                    {r}
                                </button>
                            ))}
                            {selectedRejectionReason === 'Custom reason (specify below)' && (
                                <textarea onChange={(e) => setCustomRejectionReason(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-red-100 rounded-2xl outline-none text-sm" placeholder="Detail the discrepancy..." />
                            )}
                        </div>
                        <div className="p-8 pt-0 flex gap-4">
                            <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400">Cancel</button>
                            <button onClick={confirmReject} className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all">CONFIRM REJECTION</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocValidation;
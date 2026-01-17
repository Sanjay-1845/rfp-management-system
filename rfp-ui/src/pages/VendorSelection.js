import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, CheckCircle, Plus, Users, X } from 'lucide-react';
import { rfpApi, vendorApi } from '../services/api';

const VendorSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedRfpId, setSelectedRfpId] = useState(location.state?.selectedRfpId || '');
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showAddVendor, setShowAddVendor] = useState(false);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rfpRes, vendorRes] = await Promise.all([
                rfpApi.getAll(),
                vendorApi.getAll()
            ]);
            setRfps(rfpRes.data);
            setVendors(vendorRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleVendorToggle = (vendorId) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSendRFP = async () => {
        if (!selectedRfpId) {
            setError('Please select an RFP');
            return;
        }
        if (selectedVendors.length === 0) {
            setError('Please select at least one vendor');
            return;
        }

        setSending(true);
        setError('');

        try {
            await rfpApi.sendToVendors(selectedRfpId, selectedVendors);
            setSuccess(true);
        } catch (err) {
            console.error('Failed to send RFP:', err);
            setError('Failed to send RFP to vendors');
        } finally {
            setSending(false);
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        try {
            const response = await vendorApi.create(newVendor);
            setVendors(prev => [...prev, response.data]);
            setNewVendor({ name: '', email: '', description: '' });
            setShowAddVendor(false);
        } catch (err) {
            console.error('Failed to add vendor:', err);
            setError('Failed to add vendor');
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">RFP Sent Successfully!</h1>
                    <p className="page-subtitle">Your RFP has been sent to the selected vendors</p>
                </div>

                <div className="card" style={{ borderColor: 'var(--color-success)', borderWidth: '2px', textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                    <h2 className="card-title mb-sm">Emails Sent!</h2>
                    <p className="text-muted mb-lg">
                        The RFP has been sent to {selectedVendors.length} vendor(s).
                        They will receive an email with the RFP details.
                    </p>
                    <div className="flex gap-md justify-center">
                        <button className="btn btn-primary" onClick={() => navigate('/compare')}>
                            View Proposals
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Send RFP to Vendors</h1>
                <p className="page-subtitle">Select an RFP and choose vendors to send it to</p>
            </div>

            {/* RFP Selection */}
            <div className="card mb-lg">
                <h2 className="card-title mb-md">1. Select RFP</h2>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <select
                        className="form-select"
                        value={selectedRfpId}
                        onChange={(e) => setSelectedRfpId(e.target.value)}
                    >
                        <option value="">Choose an RFP...</option>
                        {rfps.map(rfp => (
                            <option key={rfp.rfpId} value={rfp.rfpId}>
                                {rfp.title} {rfp.status === 'SENT' && '(Already Sent)'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Vendor Selection */}
            <div className="card mb-lg">
                <div className="flex justify-between items-center mb-md">
                    <h2 className="card-title">2. Select Vendors</h2>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowAddVendor(true)}>
                        <Plus size={16} />
                        Add Vendor
                    </button>
                </div>

                {vendors.length === 0 ? (
                    <div className="empty-state">
                        <Users className="empty-state-icon" />
                        <h3 className="empty-state-title">No vendors available</h3>
                        <p className="empty-state-description">
                            Add vendors to send your RFP to.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowAddVendor(true)}>
                            <Plus size={18} />
                            Add Vendor
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {vendors.map(vendor => (
                            <label
                                key={vendor.vendorId}
                                className="form-checkbox"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: selectedVendors.includes(vendor.vendorId) ? 'var(--color-bg-secondary)' : 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: selectedVendors.includes(vendor.vendorId) ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                                    cursor: 'pointer'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(vendor.vendorId)}
                                    onChange={() => handleVendorToggle(vendor.vendorId)}
                                />
                                <div>
                                    <div className="font-medium">{vendor.name}</div>
                                    <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{vendor.email}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-lg" style={{ color: 'var(--color-danger)' }}>
                    {error}
                </div>
            )}

            {/* Send Button */}
            <button
                className="btn btn-primary btn-lg"
                onClick={handleSendRFP}
                disabled={sending || !selectedRfpId || selectedVendors.length === 0}
            >
                {sending ? (
                    <>
                        <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                        Sending...
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        Send RFP to {selectedVendors.length} Vendor(s)
                    </>
                )}
            </button>

            {/* Add Vendor Modal */}
            {showAddVendor && (
                <div className="modal-overlay" onClick={() => setShowAddVendor(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add New Vendor</h3>
                            <button className="modal-close" onClick={() => setShowAddVendor(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddVendor}>
                            <div className="form-group">
                                <label className="form-label">Vendor Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={newVendor.email}
                                    onChange={(e) => setNewVendor(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description (Optional)</label>
                                <textarea
                                    className="form-textarea"
                                    value={newVendor.description}
                                    onChange={(e) => setNewVendor(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddVendor(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSelection;

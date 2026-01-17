import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { rfpApi, vendorApi } from '../services/api';
import axios from 'axios';

const MockVendorResponse = () => {
    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        selectedRfpId: '',
        selectedVendorEmail: '',
        customEmail: '',
        useCustomEmail: false,
        proposalText: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rfpRes, vendorRes] = await Promise.all([
                rfpApi.getAll(),
                vendorApi.getAll()
            ]);
            // Show all RFPs since we don't track whether they've been sent
            setRfps(rfpRes.data);
            setVendors(vendorRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const generateSampleProposal = () => {
        const selectedRfp = rfps.find(r => r.rfpId === formData.selectedRfpId);
        if (!selectedRfp) return;

        const sampleProposal = `Dear Procurement Team,

Thank you for the opportunity to submit our proposal for "${selectedRfp.title}".

PROPOSAL DETAILS:
-----------------

PRICING:
Total Amount: $${Math.floor(Math.random() * 10000 + 40000)}
Currency: USD

DELIVERY:
Estimated Delivery: ${Math.floor(Math.random() * 20 + 10)} business days from order confirmation

WARRANTY:
We offer a ${Math.floor(Math.random() * 2 + 1)}-year comprehensive warranty covering:
- Manufacturing defects
- Hardware failures
- On-site support

PAYMENT TERMS:
- 30% advance payment
- 70% upon delivery and acceptance

ADDITIONAL NOTES:
- Free installation and setup
- 24/7 technical support hotline
- Training session for your team included

We look forward to working with you on this project.

Best regards,
${formData.useCustomEmail ? formData.customEmail.split('@')[0] : vendors.find(v => v.email === formData.selectedVendorEmail)?.name || 'Vendor'}`;

        setFormData(prev => ({ ...prev, proposalText: sampleProposal }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const vendorEmail = formData.useCustomEmail ? formData.customEmail : formData.selectedVendorEmail;

        if (!formData.selectedRfpId || !vendorEmail || !formData.proposalText) {
            setError('Please fill in all required fields');
            return;
        }

        setSending(true);

        try {
            // Construct the subject with RFP ID format expected by the API
            const subject = `RE: RFP-${formData.selectedRfpId}: Proposal Submission`;

            await axios.post('http://localhost:4000/webhooks/sendgrid/inbound', {
                from: vendorEmail,
                subject: subject,
                text: formData.proposalText
            });

            setSuccess(true);
        } catch (err) {
            console.error('Failed to submit mock response:', err);
            setError(err.response?.data || 'Failed to submit vendor response');
        } finally {
            setSending(false);
        }
    };

    const handleReset = () => {
        setFormData({
            selectedRfpId: '',
            selectedVendorEmail: '',
            customEmail: '',
            useCustomEmail: false,
            proposalText: ''
        });
        setSuccess(false);
        setError('');
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
                    <h1 className="page-title">Response Submitted!</h1>
                    <p className="page-subtitle">The mock vendor response has been processed</p>
                </div>

                <div className="card" style={{ borderColor: 'var(--color-success)', borderWidth: '2px', textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                    <h2 className="card-title mb-sm">Proposal Received!</h2>
                    <p className="text-muted mb-lg">
                        The vendor response has been processed by the AI and stored as a proposal.
                        You can now view it in the proposal comparison page.
                    </p>
                    <div className="flex gap-md justify-center">
                        <button className="btn btn-primary" onClick={handleReset}>
                            Submit Another Response
                        </button>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/compare'}>
                            View Proposals
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Mock Vendor Response</h1>
                <p className="page-subtitle">Simulate a vendor email response for testing the proposal parsing</p>
            </div>

            {/* Info Banner */}
            <div className="card mb-lg" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--color-info)' }}>
                <div className="flex items-center gap-md">
                    <Mail size={24} color="var(--color-info)" />
                    <div>
                        <h3 className="font-semibold" style={{ color: 'var(--color-info)' }}>SendGrid Inbound Parse Mock</h3>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            This page simulates the inbound email webhook that would normally be triggered by SendGrid
                            when a vendor replies to an RFP email. Use this to test the proposal extraction flow.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* RFP Selection */}
                <div className="card mb-lg">
                    <h2 className="card-title mb-md">1. Select RFP</h2>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select
                            className="form-select"
                            value={formData.selectedRfpId}
                            onChange={(e) => setFormData(prev => ({ ...prev, selectedRfpId: e.target.value }))}
                        >
                            <option value="">Choose an RFP to respond to...</option>
                            {rfps.map(rfp => (
                                <option key={rfp.rfpId} value={rfp.rfpId}>
                                    {rfp.title} (RFP-{rfp.rfpId.substring(0, 8)}...)
                                </option>
                            ))}
                        </select>
                    </div>
                    {rfps.length === 0 && (
                        <p className="text-muted mt-md" style={{ fontSize: 'var(--font-size-sm)' }}>
                            <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            No RFPs available. Create an RFP first before simulating responses.
                        </p>
                    )}
                </div>

                {/* Vendor Selection */}
                <div className="card mb-lg">
                    <h2 className="card-title mb-md">2. Vendor Email (Sender)</h2>

                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.useCustomEmail}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    useCustomEmail: e.target.checked,
                                    selectedVendorEmail: ''
                                }))}
                            />
                            <span>Use custom email address</span>
                        </label>
                    </div>

                    {formData.useCustomEmail ? (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Custom Vendor Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.customEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, customEmail: e.target.value }))}
                                placeholder="vendor@example.com"
                            />
                        </div>
                    ) : (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Select Existing Vendor</label>
                            <select
                                className="form-select"
                                value={formData.selectedVendorEmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, selectedVendorEmail: e.target.value }))}
                            >
                                <option value="">Choose a vendor...</option>
                                {vendors.map(vendor => (
                                    <option key={vendor.vendorId} value={vendor.email}>
                                        {vendor.name} ({vendor.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Proposal Content */}
                <div className="card mb-lg">
                    <div className="flex justify-between items-center mb-md">
                        <h2 className="card-title" style={{ marginBottom: 0 }}>3. Proposal Email Content</h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={generateSampleProposal}
                            disabled={!formData.selectedRfpId}
                        >
                            Generate Sample Proposal
                        </button>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <textarea
                            className="form-textarea"
                            value={formData.proposalText}
                            onChange={(e) => setFormData(prev => ({ ...prev, proposalText: e.target.value }))}
                            placeholder="Enter the vendor's proposal email content here. Include pricing, delivery timeline, warranty, and payment terms for best AI extraction results."
                            rows={12}
                        />
                    </div>
                    <p className="text-muted mt-sm" style={{ fontSize: 'var(--font-size-xs)' }}>
                        Tip: Include clear sections for pricing (total amount), delivery days, warranty terms, and payment terms.
                    </p>
                </div>

                {error && (
                    <div className="mb-lg" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={sending || !formData.selectedRfpId || !formData.proposalText ||
                        (!formData.selectedVendorEmail && !formData.customEmail)}
                >
                    {sending ? (
                        <>
                            <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Mock Vendor Response
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MockVendorResponse;

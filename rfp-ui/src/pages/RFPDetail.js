import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, BarChart3, Package, DollarSign, Clock, Shield, FileText } from 'lucide-react';
import { rfpApi } from '../services/api';

const RFPDetail = () => {
    const { rfpId } = useParams();
    const navigate = useNavigate();
    const [rfp, setRfp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRFP();
    }, [rfpId]);

    const fetchRFP = async () => {
        try {
            const response = await rfpApi.getAll();
            const foundRfp = response.data.find(r => r.rfpId === rfpId);
            if (foundRfp) {
                setRfp(foundRfp);
            } else {
                setError('RFP not found');
            }
        } catch (err) {
            console.error('Failed to fetch RFP:', err);
            setError('Failed to load RFP details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'SENT') {
            return <span className="badge badge-success">Sent to Vendors</span>;
        }
        return <span className="badge badge-neutral">Draft</span>;
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="empty-state">
                    <FileText className="empty-state-icon" />
                    <h3 className="empty-state-title">{error}</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-md mb-lg">
                <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <div className="flex items-center gap-md">
                        <h1 className="page-title">{rfp.title}</h1>
                        {getStatusBadge(rfp.status)}
                    </div>
                    <p className="page-subtitle">RFP ID: {rfp.rfpId}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-md mb-lg">
                {rfp.status !== 'SENT' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/send-rfp', { state: { selectedRfpId: rfp.rfpId } })}
                    >
                        <Send size={18} />
                        Send to Vendors
                    </button>
                )}
                {rfp.status === 'SENT' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/compare', { state: { selectedRfpId: rfp.rfpId } })}
                    >
                        <BarChart3 size={18} />
                        View Proposals
                    </button>
                )}
            </div>

            {/* RFP Details */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {rfp.structured?.budget?.amount && (
                    <div className="stat-card">
                        <div className="flex items-center gap-sm mb-sm">
                            <DollarSign size={18} color="var(--color-success)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>Budget</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
                            ${rfp.structured.budget.amount.toLocaleString()}
                        </div>
                    </div>
                )}
                {rfp.structured?.constraints?.deliveryDays && (
                    <div className="stat-card">
                        <div className="flex items-center gap-sm mb-sm">
                            <Clock size={18} color="var(--color-warning)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>Delivery</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>
                            {rfp.structured.constraints.deliveryDays} days
                        </div>
                    </div>
                )}
                {rfp.structured?.constraints?.warranty && (
                    <div className="stat-card">
                        <div className="flex items-center gap-sm mb-sm">
                            <Shield size={18} color="var(--color-info)" />
                            <span className="stat-label" style={{ marginBottom: 0 }}>Warranty</span>
                        </div>
                        <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>
                            {rfp.structured.constraints.warranty}
                        </div>
                    </div>
                )}
            </div>

            {/* Items Required */}
            {rfp.structured?.items?.length > 0 && (
                <div className="card mb-lg">
                    <div className="flex items-center gap-sm mb-md">
                        <Package size={20} color="var(--color-accent-primary)" />
                        <h2 className="card-title" style={{ marginBottom: 0 }}>Items Required</h2>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Specifications</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfp.structured.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="font-medium">{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td className="text-muted">
                                            {typeof item.specifications === 'object'
                                                ? Object.entries(item.specifications).map(([key, value]) => (
                                                    <span key={key} style={{ marginRight: 'var(--spacing-md)' }}>
                                                        <strong>{key}:</strong> {value}
                                                    </span>
                                                ))
                                                : item.specifications || '-'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Constraints */}
            {rfp.structured?.constraints && (
                <div className="card mb-lg">
                    <h2 className="card-title mb-md">Constraints & Requirements</h2>
                    <div className="flex flex-col gap-md">
                        {rfp.structured.constraints.paymentTerms && (
                            <div>
                                <span className="text-muted">Payment Terms: </span>
                                <span className="font-medium">{rfp.structured.constraints.paymentTerms}</span>
                            </div>
                        )}
                        {rfp.structured.additionalNotes && (
                            <div>
                                <span className="text-muted">Additional Notes: </span>
                                <span>{rfp.structured.additionalNotes}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Raw Input */}
            <div className="card">
                <h2 className="card-title mb-md">Original Request</h2>
                <div style={{
                    background: 'var(--color-bg-tertiary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                }}>
                    {rfp.rawInput}
                </div>
            </div>
        </div>
    );
};

export default RFPDetail;

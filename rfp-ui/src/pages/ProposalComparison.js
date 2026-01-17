import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart3, Trophy, AlertCircle, Sparkles } from 'lucide-react';
import { rfpApi, proposalApi } from '../services/api';

const ProposalComparison = () => {
    const location = useLocation();
    const [rfps, setRfps] = useState([]);
    const [selectedRfpId, setSelectedRfpId] = useState(location.state?.selectedRfpId || '');
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRFPs();
    }, []);

    useEffect(() => {
        if (selectedRfpId) {
            fetchComparison();
        }
    }, [selectedRfpId]);

    const fetchRFPs = async () => {
        try {
            // Get only RFPs that have proposals
            const response = await proposalApi.getRFPsWithProposals();
            setRfps(response.data);
        } catch (err) {
            console.error('Failed to fetch RFPs:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComparison = async () => {
        setComparing(true);
        setError('');
        setComparison(null);

        try {
            const response = await rfpApi.getComparison(selectedRfpId);
            setComparison(response.data);
        } catch (err) {
            console.error('Failed to fetch comparison:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to load proposal comparison');
            }
        } finally {
            setComparing(false);
        }
    };

    const getBestValue = (proposals, field, isLower = false) => {
        const values = proposals.map(p => p[field]).filter(v => v != null);
        if (values.length === 0) return null;
        return isLower ? Math.min(...values) : Math.max(...values);
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Proposal Comparison</h1>
                <p className="page-subtitle">Compare vendor proposals and view AI recommendations</p>
            </div>

            {/* RFP Selection */}
            <div className="card mb-lg">
                <h2 className="card-title mb-md">Select RFP to Compare</h2>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <select
                        className="form-select"
                        value={selectedRfpId}
                        onChange={(e) => setSelectedRfpId(e.target.value)}
                    >
                        <option value="">Choose an RFP...</option>
                        {rfps.map(rfp => (
                            <option key={rfp.rfpId} value={rfp.rfpId}>
                                {rfp.title}
                            </option>
                        ))}
                    </select>
                </div>
                {rfps.length === 0 && (
                    <p className="text-muted mt-md" style={{ fontSize: 'var(--font-size-sm)' }}>
                        No proposals have been received yet. Submit mock vendor responses first.
                    </p>
                )}
            </div>

            {comparing && (
                <div className="card">
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p className="mt-md text-muted">Analyzing proposals...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="card">
                    <div className="empty-state">
                        <AlertCircle size={48} color="var(--color-warning)" />
                        <h3 className="empty-state-title mt-md">{error}</h3>
                        <p className="empty-state-description">
                            Vendors need to respond with their proposals before comparison is available.
                        </p>
                    </div>
                </div>
            )}

            {comparison && !comparing && (
                <>
                    {/* RFP Summary */}
                    <div className="card mb-lg">
                        <h2 className="card-title mb-sm">{comparison.rfp.title}</h2>
                        <div className="flex gap-lg" style={{ flexWrap: 'wrap' }}>
                            {comparison.rfp.constraints?.deliveryDays && (
                                <span className="text-muted">
                                    Required Delivery: <span className="font-medium">{comparison.rfp.constraints.deliveryDays} days</span>
                                </span>
                            )}
                            {comparison.rfp.constraints?.warranty && (
                                <span className="text-muted">
                                    Required Warranty: <span className="font-medium">{comparison.rfp.constraints.warranty}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="card mb-lg">
                        <div className="flex items-center gap-sm mb-md">
                            <BarChart3 size={20} color="var(--color-accent-primary)" />
                            <h2 className="card-title" style={{ marginBottom: 0 }}>Vendor Proposals</h2>
                        </div>

                        {comparison.proposals.length === 0 ? (
                            <div className="empty-state">
                                <AlertCircle size={48} color="var(--color-text-muted)" />
                                <h3 className="empty-state-title">No proposals received yet</h3>
                                <p className="empty-state-description">
                                    Waiting for vendors to respond with their proposals.
                                </p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Pricing</th>
                                            <th>Delivery (Days)</th>
                                            <th>Warranty</th>
                                            <th>Payment Terms</th>
                                            <th>AI Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparison.proposals.map((proposal, index) => {
                                            const bestPrice = getBestValue(comparison.proposals, 'pricing', true);
                                            const bestDelivery = getBestValue(comparison.proposals, 'deliveryDays', true);
                                            const bestScore = getBestValue(comparison.proposals, 'aiScore', false);

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div>
                                                            <span className="font-medium">{proposal.vendorName}</span>
                                                            <div className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                                {proposal.vendorEmail}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            color: proposal.pricing === bestPrice ? 'var(--color-success)' : 'inherit',
                                                            fontWeight: proposal.pricing === bestPrice ? '600' : '400'
                                                        }}>
                                                            {proposal.pricing ? `$${proposal.pricing.toLocaleString()}` : '-'}
                                                            {proposal.pricing === bestPrice && ' ✓'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            color: proposal.deliveryDays === bestDelivery ? 'var(--color-success)' : 'inherit',
                                                            fontWeight: proposal.deliveryDays === bestDelivery ? '600' : '400'
                                                        }}>
                                                            {proposal.deliveryDays || '-'}
                                                            {proposal.deliveryDays === bestDelivery && ' ✓'}
                                                        </span>
                                                    </td>
                                                    <td>{proposal.warranty || '-'}</td>
                                                    <td>{proposal.paymentTerms || '-'}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${proposal.aiScore === bestScore ? 'badge-success' : 'badge-neutral'}`}
                                                            style={{ fontWeight: '600' }}
                                                        >
                                                            {proposal.aiScore?.toFixed(1) || '-'}
                                                            {proposal.aiScore === bestScore && (
                                                                <Trophy size={12} style={{ marginLeft: '4px' }} />
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* AI Recommendation */}
                    {comparison.recommendation && (
                        <div className="recommendation-card">
                            <div className="recommendation-header">
                                <Sparkles size={24} color="var(--color-accent-primary)" />
                                <h2 className="recommendation-title">AI Recommendation</h2>
                            </div>
                            <div className="recommendation-content">
                                {typeof comparison.recommendation === 'string'
                                    ? comparison.recommendation
                                    : (
                                        <>
                                            {comparison.recommendation.summary && (
                                                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                                                    {comparison.recommendation.summary}
                                                </p>
                                            )}
                                            {comparison.recommendation.recommendedVendor && (
                                                <p>
                                                    <strong>Recommended Vendor:</strong> {comparison.recommendation.recommendedVendor}
                                                </p>
                                            )}
                                            {comparison.recommendation.reasoning && (
                                                <p style={{ marginTop: 'var(--spacing-sm)' }}>
                                                    <strong>Reasoning:</strong> {comparison.recommendation.reasoning}
                                                </p>
                                            )}
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProposalComparison;

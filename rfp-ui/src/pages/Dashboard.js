import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Send, BarChart3, Users } from 'lucide-react';
import { rfpApi, vendorApi } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [rfps, setRfps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRfps: 0,
        totalVendors: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rfpResponse, vendorResponse] = await Promise.all([
                rfpApi.getAll(),
                vendorApi.getAll()
            ]);
            const rfpData = rfpResponse.data;
            setRfps(rfpData);

            setStats({
                totalRfps: rfpData.length,
                totalVendors: vendorResponse.data.length
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
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
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of your RFP management activities</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card accent">
                    <div className="stat-label">Total RFPs</div>
                    <div className="stat-value">{stats.totalRfps}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Vendors</div>
                    <div className="stat-value">{stats.totalVendors}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mb-lg">
                <div className="card-header">
                    <h2 className="card-title">Quick Actions</h2>
                </div>
                <div className="flex gap-md">
                    <button className="btn btn-primary" onClick={() => navigate('/create-rfp')}>
                        <Plus size={18} />
                        Create New RFP
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/send-rfp')}>
                        <Send size={18} />
                        Send to Vendors
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/compare')}>
                        <BarChart3 size={18} />
                        Compare Proposals
                    </button>
                </div>
            </div>

            {/* Recent RFPs */}
            <div className="card">
                <div className="card-header flex justify-between items-center">
                    <h2 className="card-title">Recent RFPs</h2>
                </div>

                {rfps.length === 0 ? (
                    <div className="empty-state">
                        <FileText className="empty-state-icon" />
                        <h3 className="empty-state-title">No RFPs yet</h3>
                        <p className="empty-state-description">
                            Create your first RFP to get started with vendor management.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/create-rfp')}>
                            <Plus size={18} />
                            Create RFP
                        </button>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Budget</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfps.slice(0, 5).map((rfp) => (
                                    <tr key={rfp.rfpId}>
                                        <td>
                                            <span className="font-medium">{rfp.title}</span>
                                        </td>
                                        <td>
                                            {rfp.structured?.budget?.amount
                                                ? `$${rfp.structured.budget.amount.toLocaleString()}`
                                                : '-'
                                            }
                                        </td>
                                        <td><span className="badge badge-neutral">Created</span></td>
                                        <td className="text-muted">
                                            {new Date(rfp.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => navigate(`/rfp/${rfp.rfpId}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

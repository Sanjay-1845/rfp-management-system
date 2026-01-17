import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Users } from 'lucide-react';
import { vendorApi } from '../services/api';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', description: '', capabilities: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await vendorApi.getAll();
            setVendors(response.data);
        } catch (err) {
            console.error('Failed to fetch vendors:', err);
            setError('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData({
                name: vendor.name,
                email: vendor.email,
                description: vendor.description || '',
                capabilities: vendor.capabilities?.join(', ') || ''
            });
        } else {
            setEditingVendor(null);
            setFormData({ name: '', email: '', description: '', capabilities: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVendor(null);
        setFormData({ name: '', email: '', description: '', capabilities: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const vendorData = {
            name: formData.name,
            email: formData.email,
            description: formData.description,
            capabilities: formData.capabilities.split(',').map(c => c.trim()).filter(c => c)
        };

        try {
            if (editingVendor) {
                await vendorApi.update(editingVendor.vendorId, vendorData);
                setVendors(prev => prev.map(v =>
                    v.vendorId === editingVendor.vendorId ? { ...v, ...vendorData } : v
                ));
            } else {
                const response = await vendorApi.create(vendorData);
                setVendors(prev => [...prev, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save vendor:', err);
            setError('Failed to save vendor');
        }
    };

    const handleDelete = async (vendorId) => {
        if (!window.confirm('Are you sure you want to delete this vendor?')) return;

        try {
            await vendorApi.delete(vendorId);
            setVendors(prev => prev.filter(v => v.vendorId !== vendorId));
        } catch (err) {
            console.error('Failed to delete vendor:', err);
            setError('Failed to delete vendor');
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
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Vendor Management</h1>
                    <p className="page-subtitle">Manage your vendor list for RFP distribution</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} />
                    Add Vendor
                </button>
            </div>

            {error && (
                <div className="mb-lg" style={{ color: 'var(--color-danger)' }}>
                    {error}
                </div>
            )}

            {vendors.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Users className="empty-state-icon" />
                        <h3 className="empty-state-title">No vendors yet</h3>
                        <p className="empty-state-description">
                            Add your first vendor to start sending RFPs.
                        </p>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <Plus size={18} />
                            Add Vendor
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Description</th>
                                    <th>Capabilities</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map(vendor => (
                                    <tr key={vendor.vendorId}>
                                        <td className="font-medium">{vendor.name}</td>
                                        <td>{vendor.email}</td>
                                        <td className="text-muted">{vendor.description || '-'}</td>
                                        <td>
                                            {vendor.capabilities?.length > 0 ? (
                                                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                                    {vendor.capabilities.map((cap, idx) => (
                                                        <span key={idx} className="badge badge-info">{cap}</span>
                                                    ))}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <div className="flex gap-sm">
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleOpenModal(vendor)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleDelete(vendor.vendorId)}
                                                    style={{ color: 'var(--color-danger)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Vendor Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Capabilities (comma-separated)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.capabilities}
                                    onChange={(e) => setFormData(prev => ({ ...prev, capabilities: e.target.value }))}
                                    placeholder="e.g., Hardware, Software, Support"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingVendor ? 'Update' : 'Add'} Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;

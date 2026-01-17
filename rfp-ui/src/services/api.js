import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// RFP API
export const rfpApi = {
    getAll: () => api.get('/api/rfps'),
    getById: (rfpId) => api.get(`/api/rfps/${rfpId}`),
    create: (data) => api.post('/api/rfps', data),
    createFromText: (text) => api.post('/api/rfps/from-text', { text }),
    sendToVendors: (rfpId, vendorIds) => api.post(`/api/rfps/${rfpId}/send`, { vendorIds }),
    getComparison: (rfpId) => api.get(`/api/rfps/${rfpId}/comparison`),
};

// Vendor API
export const vendorApi = {
    getAll: () => api.get('/api/vendors'),
    create: (data) => api.post('/api/vendors', data),
    update: (vendorId, data) => api.put(`/api/vendors/${vendorId}`, data),
    delete: (vendorId) => api.delete(`/api/vendors/${vendorId}`),
};

// Proposal API
export const proposalApi = {
    getRFPsWithProposals: () => api.get('/api/proposals/rfps-with-proposals'),
    getByRFP: (rfpId) => api.get(`/api/proposals/rfp/${rfpId}`),
};

export default api;

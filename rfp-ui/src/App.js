import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import VendorSelection from './pages/VendorSelection';
import VendorManagement from './pages/VendorManagement';
import RFPDetail from './pages/RFPDetail';
import ProposalComparison from './pages/ProposalComparison';
import MockVendorResponse from './pages/MockVendorResponse';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create-rfp" element={<CreateRFP />} />
                        <Route path="/vendors" element={<VendorManagement />} />
                        <Route path="/send-rfp" element={<VendorSelection />} />
                        <Route path="/rfp/:rfpId" element={<RFPDetail />} />
                        <Route path="/compare" element={<ProposalComparison />} />
                        <Route path="/mock-response" element={<MockVendorResponse />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

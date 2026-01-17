import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus,
    Users,
    Send,
    BarChart3,
    FileText,
    Mail
} from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <FileText size={18} color="white" />
                    </div>
                    <span>RFP Manager</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-title">Main</span>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/create-rfp" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <FilePlus size={20} />
                        Create RFP
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Management</span>
                    <NavLink to="/vendors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        Vendors
                    </NavLink>
                    <NavLink to="/send-rfp" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Send size={20} />
                        Send to Vendors
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Analysis</span>
                    <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <BarChart3 size={20} />
                        Compare Proposals
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Testing</span>
                    <NavLink to="/mock-response" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Mail size={20} />
                        Mock Vendor Response
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;

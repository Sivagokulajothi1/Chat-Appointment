import { useState } from 'react';
import { BsGridFill } from 'react-icons/bs';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaWhatsapp,
    FaClock,
    FaUsers,
    FaHeartbeat,
    FaCog,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaChartLine,
    FaFileDownload,
    FaUserInjured,
    FaUserFriends
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CustomModal from '../CustomModal/CustomModal';
import './Navbar.css';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const getActiveNav = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path.includes('/doctors')) return 'Doctors';
         if (path.includes('/doctors')) return 'Patients';
        if (path.includes('/slots')) return 'Slot Config';
        if (path.includes('/appointments')) return 'Appointments';
        if (path.includes('/whatsapp')) return 'WhatsApp';
        if (path.includes('/users')) return 'Users';
        if (path.includes('/analytics')) return 'Analytics';
        if (path.includes('/settings')) return 'System Settings';
        return 'Dashboard';
    };

    const activeNav = getActiveNav();

    const navItems = [
        { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <BsGridFill /> },
        { id: 'appointments', path: '/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
        { id: 'doctors', path: '/doctors', label: 'Doctors', icon: <FaUserInjured /> },
        { id: 'patients', path: '/patients', label: 'Patients', icon: <FaUserFriends/> },
        { id: 'analytics', path: '/analytics', label: 'Analytics', icon: <FaChartLine /> },
        { id: 'slots', path: '/slots', label: 'Slot Config', icon: <FaClock /> },
        { id: 'whatsapp', path: '/whatsapp', label: 'WhatsApp', icon: <FaWhatsapp /> },
        { id: 'users', path: '/users', label: 'Users', icon: <FaUsers /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="navbar-mobile-header">
                <button className="navbar-menu-toggle" onClick={toggleSidebar}>
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div className="navbar-mobile-logo">
                    <h1>MedSync WA</h1>
                    <span>Admin Dashboard</span>
                </div>
            </div>

            {/* Sidebar/Navbar */}
            <nav className={`navbar-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                {/* Logo Section */}
                <div className="navbar-logo-section">
                    <div className="navbar-brand-logo">
                        <FaHeartbeat className="nav-brand-icon" />
                        Mithin <span>Clinic</span>
                    </div>
                    <p className="navbar-subtitle">ADMIN DASHBOARD</p>
                </div>

                {/* Navigation Items */}
                <div className="navbar-nav-section">
                    <ul className="navbar-nav-list">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `navbar-nav-item ${isActive || activeNav === item.label ? 'active' : ''}`
                                    }
                                >
                                    <div className="navbar-nav-icon">{item.icon}</div>
                                    <span className="navbar-nav-label">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User Profile / Bottom Section */}
                <div className="navbar-user-section">
                    <div className="nav-profile-card" onClick={toggleProfileModal} style={{ cursor: 'pointer' }}>
                        <div className="profile-avatar">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=f0fdf4&color=16a34a&bold=true" alt="User" />
                        </div>
                        <div className="profile-info">
                            <p className="profile-name">Admin User</p>
                            <p className="profile-role">System Manager</p>
                        </div>
                    </div>
                </div>
            </nav>

            <CustomModal
                isOpen={isProfileModalOpen}
                onClose={toggleProfileModal}
                title="Account Settings"
            >
                <div className="profile-modal-content">
                    <div className="profile-modal-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=f0fdf4&color=16a34a&bold=true" alt="User Avatar" style={{ width: '64px', height: '64px', borderRadius: '16px' }} />
                        <div className="modal-user-info">
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Admin User</h3>
                            <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>admin@medsync.wa</p>
                            <span className="role-badge" style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>System Manager</span>
                        </div>
                    </div>

                    <div className="modal-actions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            className="modal-action-item"
                            onClick={() => { navigate('/settings'); toggleProfileModal(); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}
                        >
                            <div className="action-icon settings" style={{ fontSize: '1.25rem', color: '#64748b' }}><FaCog /></div>
                            <div className="action-text">
                                <span style={{ display: 'block', fontWeight: 600, color: '#0f172a' }}>System Settings</span>
                                <p style={{ margin: '0.125rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>Manage clinic preferences and automation</p>
                            </div>
                        </button>

                        <button
                            className="modal-action-item logout"
                            onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}
                        >
                            <div className="action-icon logout" style={{ fontSize: '1.25rem', color: '#ef4444' }}><FaSignOutAlt /></div>
                            <div className="action-text">
                                <span style={{ display: 'block', fontWeight: 600, color: '#ef4444' }}>Log Out</span>
                                <p style={{ margin: '0.125rem 0 0', color: '#f87171', fontSize: '0.8rem' }}>Safely sign out of your session</p>
                            </div>
                        </button>
                    </div>
                </div>
            </CustomModal>
        </>
    );
};


export default Navbar;
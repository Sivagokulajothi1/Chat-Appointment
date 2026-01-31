import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaUserShield, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Dr. Kavitha', email: 'kavitha@clinic.com', role: 'Doctor', status: 'Active', initials: 'SS', color: '#eef2ff' },
        { id: 2, name: 'Karthika', email: 'karthika@clinic.com', role: 'Receptionist', status: 'Active', initials: 'JD', color: '#e0f2fe' },
        { id: 3, name: 'Gokula Krishan', email: 'gokulakirishan@clinic.com', role: 'Admin', status: 'Active', initials: 'AJ', color: '#fef3c7' },
        { id: 4, name: 'Dr.Mithin', email: 'mithin@clinic.com', role: 'Doctor', status: 'Inactive', initials: 'RB', color: '#f3f4f6' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Receptionist',
        status: 'Active',
        password: ''
    });

    const headers = ['NAME', 'EMAIL', 'ROLE', 'STATUS', 'ACTIONS'];

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                password: ''
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'Receptionist',
                status: 'Active',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const colors = ['#eef2ff', '#e0f2fe', '#fef3c7', '#f3f4f6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                initials: initials
            } : u));
        } else {
            const newUser = {
                id: Date.now(),
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                initials: initials,
                color: randomColor
            };
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilter = () => {
        alert('Filter options:\n- Filter by Role (Admin, Doctor, Receptionist, Nurse)\n- Filter by Status (Active, Inactive)\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Status'],
            ...users.map(u => [u.name, u.email, u.role, u.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderRow = (user) => (
        <tr key={user.id}>
            <td>
                <div className="user-info-cell">
                    <div className="user-avatar" style={{ backgroundColor: user.color }}>
                        {user.initials}
                    </div>
                    <span className="user-name-text">{user.name}</span>
                </div>
            </td>
            <td>{user.email}</td>
            <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                </span>
            </td>
            <td>
                <div className="status-indicator">
                    <span className={`status-dot ${user.status.toLowerCase()}`}></span>
                    <span>{user.status}</span>
                </div>
            </td>
            <td>
                <div className="action-buttons">
                    <button className="icon-btn-small" title="Edit" onClick={() => handleOpenModal(user)}><FaEdit /></button>
                    <button className="icon-btn-small delete" title="Delete" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="users-page">
            <div className="page-header-row">
                <div className="title-section">
                    <h1>User Management</h1>
                    <p>Manage system access and roles for all clinic staff <span className="count-badge">{users.length} TOTAL USERS</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New User
                </button>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="action-group">
                    <button className="filter-btn" onClick={handleFilter}>
                        <FaFilter /> Filters
                    </button>
                    <button className="export-btn-gray" onClick={handleExport}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            <div className="table-wrapper-card">
                <CustomTable headers={headers} data={filteredUsers} renderRow={renderRow} />
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? "Edit User Requirements" : "Add New User"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>System Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option>Admin</option>
                            <option>Doctor</option>
                            <option>Receptionist</option>
                            <option>Nurse</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Reset Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.status === 'Active'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                            />
                            <span>Allow user to log in to the system</span>
                        </label>
                    </div>

                    <div className="permissions-section">
                        <p className="permissions-title"><FaUserShield /> Access Permissions</p>
                        <div className="permissions-list">
                            <label><input type="checkbox" defaultChecked /> Manage Billing & Payments</label>
                            <label><input type="checkbox" defaultChecked /> View Patient Medical Records</label>
                            <label><input type="checkbox" defaultChecked /> Edit Clinic Settings</label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            {editingUser ? "Update User" : "Save User"}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default Users;

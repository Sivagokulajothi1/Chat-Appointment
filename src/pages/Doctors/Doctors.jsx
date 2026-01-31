import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([
        { id: 1, name: 'Dr.Kavitha', dept: 'Cardiology', time: '09:00 - 17:00', slot: '15 min', status: 'ACTIVE', initials: 'SC', color: '#eef2ff' },
        { id: 2, name: 'Dr. Mithin', dept: 'Pediatrics', time: '08:00 - 16:00', slot: '30 min', status: 'ACTIVE', initials: 'JW', color: '#e0f2fe' },
        { id: 3, name: 'Dr. Gokula kirshana', dept: 'Neurology', time: '10:00 - 18:00', slot: '20 min', status: 'ON LEAVE', initials: 'ER', color: '#fef3c7' },
    
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dept: 'Cardiology',
        startTime: '09:00',
        endTime: '17:00',
        slot: '15 min'
    });

    const headers = ['DOCTOR NAME', 'DEPARTMENT', 'WORKING TIME', 'SLOT', 'STATUS', 'ACTIONS'];

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setEditingDoctor(doctor);
            const [start, end] = doctor.time.split(' - ');
            setFormData({
                name: doctor.name,
                dept: doctor.dept,
                startTime: start,
                endTime: end,
                slot: doctor.slot
            });
        } else {
            setEditingDoctor(null);
            setFormData({
                name: '',
                dept: 'Cardiology',
                startTime: '09:00',
                endTime: '17:00',
                slot: '15 min'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDoctor(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const colors = ['#eef2ff', '#e0f2fe', '#fef3c7', '#f0fdf4', '#ecfdf5', '#fef2f2'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (editingDoctor) {
            setDoctors(doctors.map(d => d.id === editingDoctor.id ? {
                ...d,
                name: formData.name,
                dept: formData.dept,
                time: `${formData.startTime} - ${formData.endTime}`,
                slot: formData.slot,
                initials: initials
            } : d));
        } else {
            const newDoctor = {
                id: Date.now(),
                name: formData.name,
                dept: formData.dept,
                time: `${formData.startTime} - ${formData.endTime}`,
                slot: formData.slot,
                status: 'ACTIVE',
                initials: initials,
                color: randomColor
            };
            setDoctors([...doctors, newDoctor]);
        }
        handleCloseModal();
    };

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilter = () => {
        alert('Filter options:\n- Filter by Department\n- Filter by Status (Active, On Leave)\n- Filter by Slot Duration\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Department', 'Working Hours', 'Slot Duration', 'Status'],
            ...doctors.map(d => [d.name, d.dept, d.time, d.slot, d.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `doctors_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderRow = (doctor) => (
        <tr key={doctor.id}>
            <td>
                <div className="doctor-info-cell">
                    <div className="doctor-avatar" style={{ backgroundColor: doctor.color }}>
                        {doctor.initials}
                    </div>
                    <span className="doctor-name-text">{doctor.name}</span>
                </div>
            </td>
            <td>
                <span className="dept-tag">{doctor.dept}</span>
            </td>
            <td>{doctor.time}</td>
            <td>{doctor.slot}</td>
            <td>
                <span className={`status-pill ${doctor.status.toLowerCase().replace(' ', '-')}`}>
                    {doctor.status}
                </span>
            </td>
            <td>
                <div className="action-buttons">
                    <button className="icon-btn-small" title="Edit" onClick={() => handleOpenModal(doctor)}><FaEdit /></button>
                    <button className="icon-btn-small delete" title="Delete" onClick={() => handleDelete(doctor.id)}><FaTrash /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="doctors-page">
            <div className="page-header-row">
                <div className="title-section">
                    <h1>Doctor Management</h1>
                    <p>Manage healthcare professionals and their schedules <span className="count-badge">{doctors.length} TOTAL DOCTORS</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New Doctor
                </button>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="action-group" style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="filter-btn" onClick={handleFilter}>
                        <FaFilter /> Filters
                    </button>
                    <button className="export-btn-gray" onClick={handleExport} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '0.75rem 1.25rem', borderRadius: '10px', color: '#4b5563', fontSize: '0.9375rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            <div className="table-wrapper-card">
                <CustomTable headers={headers} data={filteredDoctors} renderRow={renderRow} />
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter doctor's full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <select
                            value={formData.dept}
                            onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                        >
                            <option>Cardiology</option>
                            <option>Pediatrics</option>
                            <option>Neurology</option>
                            <option>General Practice</option>
                            <option>Dermatology</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Slot Duration</label>
                        <div className="radio-group">
                            {['10 min', '15 min', '30 min'].map(s => (
                                <label key={s}>
                                    <input
                                        type="radio"
                                        name="slot"
                                        checked={formData.slot === s}
                                        onChange={() => setFormData({ ...formData, slot: s })}
                                    /> {s}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            {editingDoctor ? "Update Doctor" : "Save Doctor"}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default Doctors;

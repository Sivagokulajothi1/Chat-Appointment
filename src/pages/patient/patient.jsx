import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal  from '../../components/CustomModal/CustomModal';
import './patient.css';

const Patient = () => {
    const [patient, setPatient] = useState([
        { id: 1, name: 'Kavitha', dept: 'Cardiology', time: '09:00 - 17:00', slot: '15 min', status: 'ACTIVE', initials: 'SC', color: '#eef2ff' },
        { id: 2, name: ' Mithin', dept: 'Pediatrics', time: '08:00 - 16:00', slot: '30 min', status: 'ACTIVE', initials: 'JW', color: '#e0f2fe' },
        { id: 3, name: ' Gokula kirshana', dept: 'Neurology', time: '10:00 - 18:00', slot: '20 min', status: 'ON LEAVE', initials: 'ER', color: '#fef3c7' },
    
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dept: 'Cardiology',
        startTime: '09:00',
        endTime: '17:00',
        slot: '15 min'
    });

    const headers = ['PATIENT NAME', 'DEPARTMENT', 'WORKING TIME', 'SLOT', 'STATUS', 'ACTIONS'];

    const handleOpenModal = (patient = null) => {
        if (patient) {
            setEditingPatient(patient);
            const [start, end] = patient.time.split(' - ');
            setFormData({
                name: patient.name,
                dept: patient.dept,
                startTime: start,
                endTime: end,
                slot: patient.slot
            });
        } else {
            setEditingPatient(null);
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
        setEditingPatient(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            setPatient(patient.filter(p => p.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const colors = ['#eef2ff', '#e0f2fe', '#fef3c7', '#f0fdf4', '#ecfdf5', '#fef2f2'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (editingPatient) {
            setPatient(patient.map(p => p.id === editingPatient.id ? {
                ...p,
                name: formData.name,
                dept: formData.dept,
                time: `${formData.startTime} - ${formData.endTime}`,
                slot: formData.slot,
                initials: initials
            } : p));
        } else {
            const newPatient = {
                id: Date.now(),
                name: formData.name,
                dept: formData.dept,
                time: `${formData.startTime} - ${formData.endTime}`,
                slot: formData.slot,
                status: 'ACTIVE',
                initials: initials,
                color: randomColor
            };
            setPatient([...patient, newPatient]);
        }
        handleCloseModal();
    };

    const filteredPatient = patient.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilter = () => {
        alert('Filter options:\n- Filter by Department\n- Filter by Status (Active, On Leave)\n- Filter by Slot Duration\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Department', 'Working Hours', 'Slot Duration', 'Status'],
            ...patient.map(p => [p.name, p.dept, p.time, p.slot, p.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderRow = (patient) => (
        <tr key={patient.id}>
            <td>
                <div className="patient-info-cell">
                    <div className="patient-avatar" style={{ backgroundColor: patient.color }}>
                        {patient.initials}
                    </div>
                    <span className="patient-name-text">{patient.name}</span>
                </div>
            </td>
            <td>
                <span className="dept-tag">{patient.dept}</span>
            </td>
            <td>{patient.time}</td>
            <td>{patient.slot}</td>
            <td>
                <span className={`status-pill ${patient.status.toLowerCase().replace(' ', '-')}`}>
                    {patient.status}
                </span>
            </td>
            <td>
                <div className="action-buttons">
                    <button className="icon-btn-small" title="Edit" onClick={() => handleOpenModal(patient)}><FaEdit /></button>
                    <button className="icon-btn-small delete" title="Delete" onClick={() => handleDelete(patient.id)}><FaTrash /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="patient-page">
            <div className="page-header-row">
                <div className="title-section">
                     <h1>Patient Management</h1>
                     <p>Manage healthcare professionals and their schedules <span className="count-badge">{patient.length} TOTAL PATIENT</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New Patient
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
                <CustomTable headers={headers} data={filteredPatient} renderRow={renderRow} />
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingPatient ? "Edit Patient" : "Add New Patient"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter patient's full name"
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
                            {editingPatient ? "Update Patient" : "Save Patient"}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default Patient;

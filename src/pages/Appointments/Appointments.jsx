import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaTimes, FaCalendarCheck, FaPlus, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './Appointments.css';

const Appointments = () => {
    const [activeTab, setActiveTab] = useState('All Appointments');
    const [searchQuery, setSearchQuery] = useState('');
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patient: { name: 'a.vinothini', avatar:'' },
            doctor: { name: 'Dr. kavitha', dept: 'Cardiology' },
            dateTime: { date: 'Oct 24, 2023', time: '10:30 AM' },
            status: 'Confirmed'
        },
        {
            id: 2,
            patient: { name: 'Haripriya', avatar: '' },
            doctor: { name: 'Dr. Mithin', dept: 'Neurology' },
            dateTime: { date: 'Oct 24, 2023', time: '11:45 AM' },
            status: 'Pending'
        },
        {
            id: 3,
            patient: { name: 'Naveen', avatar: '' },
            doctor: { name: 'Dr.gokula kirshan', dept: 'Internal Medicine' },
            dateTime: { date: 'Oct 24, 2023', time: '02:15 PM' },
            status: 'Confirmed'
        },
        {
            id: 4,
            patient: { name: 'Sathi', avatar: ' ' },
            doctor: { name: 'Dr. Mithin', dept: 'Cardiology' },
            dateTime: { date: 'Oct 24, 2023', time: '03:30 PM' },
            status: 'Cancelled'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: 'Dr. Emily Blunt',
        date: '',
        time: ''
    });

    const stats = [
        { label: 'Total Today', value: '42', icon: <FaCalendarAlt />, color: '#3b82f6' },
        { label: 'Pending Approval', value: '8', icon: <FaClock />, color: '#f59e0b' },
        { label: 'Upcoming', value: '156', icon: <FaCalendarCheck />, color: '#10b981' }
    ];

    const tabs = ['All Appointments', 'Pending', 'Confirmed', 'Cancelled'];

    const handleStatusChange = (id, newStatus) => {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            setAppointments(appointments.filter(apt => apt.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newApt = {
            id: Date.now(),
            patient: { name: formData.patientName, avatar: `https://i.pravatar.cc/150?u=${formData.patientName}` },
            doctor: { name: formData.doctorName, dept: 'General' },
            dateTime: { date: formData.date, time: formData.time },
            status: 'Pending'
        };
        setAppointments([...appointments, newApt]);
        setIsModalOpen(false);
        setFormData({ patientName: '', doctorName: 'Dr. Emily Blunt', date: '', time: '' });
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All Appointments' || apt.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const handleFilter = () => {
        alert('Filter options:\n- Filter by Status (Pending, Confirmed, Completed, Cancelled)\n- Filter by Doctor\n- Filter by Date Range\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Status'],
            ...appointments.map(apt => [
                apt.patient.name,
                apt.doctor.name,
                apt.doctor.dept,
                apt.dateTime.date,
                apt.dateTime.time,
                apt.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const headers = ['PATIENT NAME', 'DOCTOR', 'DATE & TIME', 'STATUS', 'ACTIONS'];

    const renderRow = (apt) => (
        <tr key={apt.id}>
            <td>
                <div className="patient-cell">
                    <img src={apt.patient.avatar} alt={apt.patient.name} className="apt-avatar" />
                    <span className="apt-name">{apt.patient.name}</span>
                </div>
            </td>
            <td>
                <div className="doctor-cell">
                    <div className="apt-doc-name">{apt.doctor.name}</div>
                    <div className="apt-doc-dept">{apt.doctor.dept}</div>
                </div>
            </td>
            <td>
                <div className="datetime-cell">
                    <div className="apt-date">{apt.dateTime.date}</div>
                    <div className="apt-time">{apt.dateTime.time}</div>
                </div>
            </td>
            <td>
                <span className={`status-pill apt-${apt.status.toLowerCase()}`}>
                    {apt.status}
                </span>
            </td>
            <td>
                <div className="apt-actions">
                    {apt.status === 'Pending' && (
                        <button className="confirm-btn-action" onClick={() => handleStatusChange(apt.id, 'Confirmed')}>CONFIRM</button>
                    )}
                    {apt.status === 'Cancelled' ? (
                        <button className="restore-link" onClick={() => handleStatusChange(apt.id, 'Confirmed')}>Restore</button>
                    ) : (
                        <>
                            <button className="icon-btn-apt" onClick={() => handleDelete(apt.id)}><FaTrash /></button>
                            <button className="icon-btn-apt cancel" onClick={() => handleStatusChange(apt.id, 'Cancelled')}><FaTimes /></button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="appointments-page">
            <div className="apt-header">
                <div className="apt-title-group">
                    <h1>Appointments</h1>
                    <p>Manage and monitor patient schedules</p>
                </div>
                <div className="apt-header-actions">
                    <div className="apt-search-wrapper">
                        <FaSearch className="apt-search-icon" />
                        <input
                            type="text"
                            placeholder="Search patients, doctors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="filter-btn-white" onClick={handleFilter} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '0.75rem 1.25rem', borderRadius: '10px', color: '#4b5563', fontSize: '0.9375rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FaFilter /> Filters
                    </button>
                    <button className="export-btn-gray" onClick={handleExport} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '0.75rem 1.25rem', borderRadius: '10px', color: '#4b5563', fontSize: '0.9375rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FaDownload /> Export
                    </button>
                    <button className="add-btn-green" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Add Appointment
                    </button>
                </div>
            </div>

            <div className="apt-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="apt-stat-card">
                        <div className="apt-stat-info">
                            <span className="apt-stat-label">{stat.label}</span>
                            <h2 className="apt-stat-value">{stat.value}</h2>
                        </div>
                        <div className="apt-stat-icon" style={{ backgroundColor: stat.color + '22', color: stat.color }}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="apt-tabs-row">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`apt-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="apt-table-card">
                <CustomTable headers={headers} data={filteredAppointments} renderRow={renderRow} />
                <div className="apt-pagination">
                    <span className="pagination-info">Showing {filteredAppointments.length} results</span>
                    <div className="pagination-buttons">
                        <button className="pag-btn">Previous</button>
                        <button className="pag-btn active">Next</button>
                    </div>
                </div>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule Appointment"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            required
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Doctor</label>
                        <select
                            value={formData.doctorName}
                            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                        >
                            <option>Dr. Emily Blunt</option>
                            <option>Dr. Michael Chen</option>
                            <option>Dr. Sarah Wilson</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Schedule</button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default Appointments;

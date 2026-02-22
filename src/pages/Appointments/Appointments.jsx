import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaTimes, FaCalendarCheck, FaPlus, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
    getAppointments,
    bookAppointment,
    confirmAppointment,
    cancelAppointment,
} from '../../services/appointments.service';
import { getDoctorsOnly } from '../../services/doctorSettings.service';
import './Appointments.css';

const Appointments = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('All Appointments');
    const [searchQuery, setSearchQuery] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Delete confirm dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    // ✅ Load appointments from API on mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await getAppointments();
            // API may return res.data.appointments or res.data.rows — adjust as needed
            setAppointments(res.data.appointments || res.data.rows || res.data || []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctorsList, setDoctorsList] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorId: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        if (isModalOpen) {
            const fetchDoctors = async () => {
                try {
                    const res = await getDoctorsOnly();
                    const fetchedDoctors = Array.isArray(res.data) ? res.data : (res.data.doctors || res.data.rows || []);
                    setDoctorsList(fetchedDoctors);
                    if (fetchedDoctors.length > 0 && !formData.doctorId) {
                        setFormData(prev => ({ ...prev, doctorId: fetchedDoctors[0].id }));
                    }
                } catch (err) {
                    console.error('Failed to fetch doctors:', err);
                }
            };
            fetchDoctors();
        }
    }, [isModalOpen]);

    // ── Dynamic stats computed from real data ────────────────────────────────
    const todayStr = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Helper for safe date parsing
    const safeDate = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d) ? null : d;
    };

    const todayCount = appointments.filter(apt => {
        const dStr = apt?.created_at || apt?.dateTime?.date || apt?.date || apt?.appointment_date || '';
        if (dStr.startsWith(todayStr)) return true;
        const dObj = safeDate(dStr);
        return dObj && dObj.toISOString().split('T')[0] === todayStr;
    }).length;

    const pendingCount = appointments.filter(apt => {
        const status = (apt?.status || '').toLowerCase();
        return status === 'pending' || status === 'booked' || status === 'slot_booked';
    }).length;

    const upcomingCount = appointments.filter(apt => {
        const dStr = apt?.created_at || apt?.dateTime?.date || apt?.date || apt?.appointment_date || '';
        const status = (apt?.status || '').toLowerCase();

        // Include today's future appointments as well by checking >= todayStr, or just use date comparison without time
        if (dStr.startsWith(todayStr) && status !== 'cancelled' && status !== 'completed') return true;

        const dObj = safeDate(dStr);
        // Compare dates (ignoring time)
        if (dObj) {
            const isFuture = dObj.toISOString().split('T')[0] > todayStr;
            return isFuture && status !== 'cancelled' && status !== 'completed';
        }
        return false;
    }).length;

    const stats = [
        { label: 'Total Today', value: todayCount, icon: <FaCalendarAlt />, color: '#3b82f6' },
        { label: 'Pending Approval', value: pendingCount, icon: <FaClock />, color: '#f59e0b' },
        { label: 'Upcoming', value: upcomingCount, icon: <FaCalendarCheck />, color: '#10b981' },
    ];

    const tabs = ['All Appointments', 'Pending', 'Confirmed', 'Cancelled'];

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (newStatus === 'Confirmed') {
                await confirmAppointment(id);
            } else if (newStatus === 'Cancelled') {
                await cancelAppointment(id, { reason: 'Cancelled by admin' });
            }
            fetchAppointments();
            showToast(`Appointment ${newStatus.toLowerCase()}`, 'success');
        } catch (err) {
            console.error('Status change failed:', err);
            showToast(err?.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleDeleteClick = (id) => {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        setAppointments(prev => prev.filter(apt => apt.id !== pendingDeleteId));
        setConfirmOpen(false);
        setPendingDeleteId(null);
        showToast('Appointment removed', 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patientName: formData.patientName,
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time,
            };
            await bookAppointment(payload);
            fetchAppointments();
            setIsModalOpen(false);
            setFormData({ patientName: '', doctorId: doctorsList[0]?.id || '', date: '', time: '' });
            showToast('Appointment booked successfully', 'success');
        } catch (err) {
            console.error('Booking failed:', err);
            showToast(err?.response?.data?.message || 'Booking failed', 'error');
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const pName = apt?.patient?.name || apt?.patient_name || apt?.name || '';
        const dName = apt?.doctor?.name || apt?.doctor_name || '';
        const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dName.toLowerCase().includes(searchQuery.toLowerCase());
        const status = apt?.status || '';
        const matchesTab = activeTab === 'All Appointments' || status === activeTab;
        return matchesSearch && matchesTab;
    });

    const handleFilter = () => {
        alert('Filter options:\n- Filter by Status (Pending, Confirmed, Completed, Cancelled)\n- Filter by Doctor\n- Filter by Date Range\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ['Patient', 'Doctor', 'Department', 'Date', 'Time', 'Status'],
            ...appointments.map(apt => [
                apt?.patient?.name || apt?.patient_name || apt?.name || '-',
                apt?.doctor?.name || apt?.doctor_name || '-',
                apt?.doctor?.dept || apt?.department || '-',
                apt?.dateTime?.date || apt?.date || apt?.appointment_date || '-',
                apt?.dateTime?.time || apt?.time || apt?.appointment_time || '-',
                apt?.status || 'Pending'
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

    const renderRow = (apt) => {
        const pName = apt?.patient?.name || apt?.patient_name || apt?.name || 'Unknown Patient';
        const pAvatar = apt?.patient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pName)}&background=random`;

        const dName = apt?.doctor?.name || apt?.doctor_name || 'Unassigned';
        const dDept = apt?.doctor?.dept || apt?.department || '—';

        const dateStr = apt?.created_at ? new Date(apt.created_at).toLocaleDateString() : (apt?.dateTime?.date || apt?.date || apt?.appointment_date || '—');
        const timeStr = apt?.created_at ? new Date(apt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (apt?.dateTime?.time || apt?.time || apt?.appointment_time || '—');
        const status = (apt?.status || 'Pending').toUpperCase();

        return (
            <tr key={apt.id}>
                <td>
                    <div className="patient-cell">
                        <img src={pAvatar} alt={pName} className="apt-avatar" />
                        <span className="apt-name">{pName}</span>
                    </div>
                </td>
                <td>
                    <div className="doctor-cell">
                        <div className="apt-doc-name">{dName}</div>
                        <div className="apt-doc-dept">{dDept}</div>
                    </div>
                </td>
                <td>
                    <div className="datetime-cell">
                        <div className="apt-date">{dateStr}</div>
                        <div className="apt-time">{timeStr}</div>
                    </div>
                </td>
                <td>
                    <span className={`status-pill apt-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </td>
                <td>
                    <div className="apt-actions">
                        {(status === 'PENDING' || status === 'BOOKED' || status === 'SLOT_BOOKED') && (
                            <button className="confirm-btn-action" onClick={() => handleStatusChange(apt.id, 'Confirmed')}>CONFIRM</button>
                        )}
                        {status === 'CANCELLED' ? (
                            <button className="restore-link" onClick={() => handleStatusChange(apt.id, 'Confirmed')}>Restore</button>
                        ) : (
                            <>
                                <button className="icon-btn-apt" onClick={() => handleDeleteClick(apt.id)}><FaTrash /></button>
                                <button className="icon-btn-apt cancel" onClick={() => handleStatusChange(apt.id, 'Cancelled')}><FaTimes /></button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

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
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select a doctor</option>
                            {doctorsList.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
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

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={confirmOpen}
                type="danger"
                title="Delete Appointment"
                message="Are you sure you want to remove this appointment?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
            />
        </div>
    );
};

export default Appointments;

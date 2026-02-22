import React, { useState, useEffect } from 'react';
import { FaFilter, FaDownload, FaEllipsisH } from 'react-icons/fa';
import { getDashboardAppointments } from '../../services/dashboard.service';
import './AppointmentMonitor.css';

// Map status string → CSS class + display label
const STATUS_MAP = {
    slot_booked: { label: 'SLOT BOOKED', cls: 'status-booked' },
    confirmed: { label: 'CONFIRMED', cls: 'status-confirmed' },
    cancelled: { label: 'CANCELLED', cls: 'status-cancelled' },
    rescheduled: { label: 'RESCHEDULED', cls: 'status-rescheduled' },
};

// Avatar background colours based on initials
const AVATAR_COLORS = [
    '#E8FBF1', '#E8F7EE', '#FDECEC', '#F3E8FF',
    '#FEF3C7', '#DBEAFE', '#FFE4E6', '#D1FAE5',
];

const getAvatarColor = (name = '') => {
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
};

const AppointmentMonitor = () => {
    const [appointments, setAppointments] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getDashboardAppointments({ page: 1, limit: 20 });
            setAppointments(res.data.appointments || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="appointment-monitor">
            <div className="monitor-header">
                <div className="header-title">
                    <h3>
                        Appointment Monitoring{' '}
                        <span className="total-badge">{total} TOTAL</span>
                    </h3>
                </div>
                <div className="header-actions">
                    <button className="action-btn">
                        <FaFilter /> Filter
                    </button>
                    <button className="action-btn">
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            <div className="table-container">
                {loading && <p style={{ padding: '16px' }}>Loading...</p>}
                {error && <p style={{ padding: '16px', color: 'red' }}>{error}</p>}

                {!loading && !error && (
                    <table className="monitor-table">
                        <thead>
                            <tr>
                                <th>PATIENT DETAILS</th>
                                <th>ASSIGNED DOCTOR</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((apt) => {
                                const statusInfo = STATUS_MAP[apt.status] || {
                                    label: apt.status?.toUpperCase() || '—',
                                    cls: 'status-booked',
                                };
                                const avatarBg = getAvatarColor(apt.patientName);

                                return (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className="patient-info">
                                                <div
                                                    className="patient-avatar"
                                                    style={{ backgroundColor: avatarBg }}
                                                >
                                                    {apt.initials}
                                                </div>
                                                <div className="patient-details">
                                                    <div className="patient-name">{apt.patientName}</div>
                                                    <div className="patient-phone">{apt.patientPhone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="doctor-name">
                                                {apt.doctorName ? `Dr. ${apt.doctorName}` : '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-chip ${statusInfo.cls}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="more-btn">
                                                <FaEllipsisH />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AppointmentMonitor;

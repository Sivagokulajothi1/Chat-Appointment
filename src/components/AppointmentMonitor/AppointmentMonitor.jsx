import React, { useState } from 'react';
import { FaFilter, FaDownload, FaEllipsisH } from 'react-icons/fa';
import './AppointmentMonitor.css';

const AppointmentMonitor = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patientName: 'Siva',
            phone: '+91 90031 23451',
            doctor: 'Dr. Mithun',
            status: 'SLOT BOOKED',
            statusClass: 'status-booked',
            initials: 'S',
            initialBg: '#E8FBF1'
        },
        {
            id: 2,
            patientName: 'A Vinothini',
            phone: '+91 90031 23452',
            doctor: 'Dr. Mithun',
            status: 'CONFIRMED',
            statusClass: 'status-confirmed',
            initials: 'AV',
            initialBg: '#E8F7EE'

        },
        {
            id: 3,
            patientName: 'A vinothini',
            phone: '+91 94451 23453',
            doctor: 'Dr. Kavitha',
            status: 'CANCELLED',
            statusClass: 'status-cancelled',
            initials: 'AV',
            initialBg: '#FDECEC'
        },
        {
            id: 4,
            patientName: 'Sarvesh.S',
            phone: '+91 98401 23454',
            doctor: 'Dr. Gokula Krishan',
            status: 'RESCHEDULED',
            statusClass: 'status-rescheduled',
            initials: 'SS',
            initialBg: '#F3E8FF'
        },
        {
            id: 5,
            patientName: 'Priya Dharshini',
            phone: '+91 90421 23455',
            doctor: 'Dr. Mithun',
            status: 'CONFIRMED',
            statusClass: 'status-confirmed',
            initials: 'PD',
            initialBg: '#E8F7EE'
        }
    ]);

    const handleAction = (id) => {
        // Toggle status for demo
        setAppointments(appointments.map(apt => {
            if (apt.id === id) {
                const nextStatus = apt.status === 'CONFIRMED' ? 'CANCELLED' : 'CONFIRMED';
                return {
                    ...apt,
                    status: nextStatus,
                    statusClass: nextStatus === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'
                };
            }
            return apt;
        }));
    };

    return (
        <div className="appointment-monitor">
            <div className="monitor-header">
                <div className="header-title">
                    <h3>Appointment Monitoring <span className="total-badge">{appointments.length} TOTAL</span></h3>
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
                        {appointments.map((apt) => (
                            <tr key={apt.id}>
                                <td>
                                    <div className="patient-info">
                                        <div className="patient-avatar" style={{ backgroundColor: apt.initialBg }}>
                                            {apt.initials}
                                        </div>
                                        <div className="patient-details">
                                            <div className="patient-name">{apt.patientName}</div>
                                            <div className="patient-phone">{apt.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="doctor-name">{apt.doctor}</div>
                                </td>
                                <td>
                                    <span className={`status-chip ${apt.statusClass}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="more-btn" onClick={() => handleAction(apt.id)}>
                                        <FaEllipsisH />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentMonitor;

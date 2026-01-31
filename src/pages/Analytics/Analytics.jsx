import React, { useState } from 'react';
import { FaCalendarAlt, FaDollarSign, FaUserPlus, FaBolt, FaUserMinus } from 'react-icons/fa';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import AnalyticsBarChart from '../../components/AnalyticsBarChart/AnalyticsBarChart';
import AnalyticsDonutChart from '../../components/AnalyticsDonutChart/AnalyticsDonutChart';
import PeakHoursChart from '../../components/PeakHoursChart/PeakHoursChart';
import './Analytics.css';

const Analytics = () => {
    const [dateRange, setDateRange] = useState('Oct 1 - Oct 31, 2023');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const stats = [
        { label: 'TOTAL REVENUE', value: '$45,200', change: '12.5%', isPositive: true, icon: FaDollarSign, color: '#39df79' },
        { label: 'PATIENT GROWTH', value: '128', change: '2.4%', isPositive: false, icon: FaUserPlus, color: '#39df79' },
        { label: 'AVG. RESPONSE TIME', value: '1.4 mins', change: '15.0%', isPositive: false, icon: FaBolt, color: '#39df79' },
        { label: 'NO-SHOW RATE', value: '4.2%', change: '0.8%', isPositive: true, icon: FaUserMinus, color: '#39df79' },
    ];

    const doctorData = [
        { label: 'Dr. Mithun', value: 285, color: '#E1FDF0' },
        { label: 'Dr. Kavitha', value: 412, color: '#39DF79' },
        { label: 'Dr. Gokula Krishan', value: 145, color: '#E1FDF0' },
    ];

    const sourceData = [
        { name: 'WhatsApp', value: 547, color: '#39DF79' },
        { name: 'Phone', value: 168, color: '#FBBF24' },
        { name: 'In-Clinic', value: 127, color: '#F87171' },
    ];

    const handleDateClick = () => {
        alert('Date range picker functionality - integrate with a date picker library like react-datepicker');
    };

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div className="header-left">
                    <h1>System Analytics & Reports</h1>
                    <div className="sync-status">
                        <span className="sync-dot"></span>
                        <p>Data synchronized 5 minutes ago</p>
                    </div>
                </div>
                <div className="header-right">
                    <div className="date-picker-mock" onClick={handleDateClick} style={{ cursor: 'pointer' }}>
                        <FaCalendarAlt className="date-icon" />
                        <span>{dateRange}</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                </div>
            </div>

            <div className="analytics-stats-row">
                {stats.map((stat, index) => (
                    <AnalyticsCard key={index} {...stat} />
                ))}
            </div>

            <div className="analytics-main-grid">
                <div className="grid-left">
                    <AnalyticsBarChart
                        title="Appointments by Doctor"
                        subtitle="Monthly comparison of patient volume"
                        total="842"
                        data={doctorData}
                    />
                </div>
                <div className="grid-right">
                    <AnalyticsDonutChart
                        title="Patient Source"
                        subtitle="Traffic distribution by channel"
                        data={sourceData}
                    />
                </div>
            </div>

            <PeakHoursChart
                title="Peak Booking Hours"
                subtitle="Hourly density of automated bookings (24h period)"
            />
        </div>
    );
};

export default Analytics;

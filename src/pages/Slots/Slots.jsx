import React, { useState } from 'react';
import { FaSlidersH, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import DayScheduleCard from '../../components/DayScheduleCard/DayScheduleCard';
import './Slots.css';

const Slots = () => {
    const [slotDuration, setSlotDuration] = useState('30m');
    const [concurrentBookings, setConcurrentBookings] = useState(1);
    const [bufferTime, setBufferTime] = useState(15);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekend'];

    return (
        <div className="slot-config-page">
            <div className="slot-header-row">
                <div className="title-group">
                    <h1>Slot Configuration</h1>
                    <p>Design your operational window and automated booking rules.</p>
                </div>
                <div className="header-buttons">
                    <button className="reset-btn">Reset to Defaults</button>
                    <button className="save-btn">Save Changes</button>
                </div>
            </div>

            <div className="config-grid">
                {/* Global Rules Section */}
                <div className="global-rules-card">
                    <div className="card-header">
                        <FaSlidersH className="header-icon" />
                        <h3>Global Rules</h3>
                    </div>

                    <div className="rules-content">
                        <div className="rule-group">
                            <label>SLOT DURATION</label>
                            <div className="duration-options">
                                {['30m', '45m', '60m'].map(dur => (
                                    <button
                                        key={dur}
                                        className={`duration-btn ${slotDuration === dur ? 'active' : ''}`}
                                        onClick={() => setSlotDuration(dur)}
                                    >
                                        {dur}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rule-group">
                            <label>CONCURRENT BOOKINGS</label>
                            <div className="concurrent-input-group">
                                <input
                                    type="number"
                                    value={concurrentBookings}
                                    onChange={(e) => setConcurrentBookings(e.target.value)}
                                    min="1"
                                />
                                <span>Person(s) per slot</span>
                            </div>
                        </div>
                    </div>

                    <div className="auto-blocking-banner">
                        <div className="banner-left">
                            <FaCalendarAlt className="banner-icon" />
                            <span>Public Holiday Auto-Blocking is <strong>Enabled</strong></span>
                        </div>
                        <button className="manage-exceptions">MANAGE EXCEPTIONS</button>
                    </div>
                </div>

                {/* WhatsApp Buffer Card */}
                <div className="whatsapp-buffer-card">
                    <div className="buffer-info">
                        <h3>WhatsApp Buffer</h3>
                        <p>Preparation time between automated sessions.</p>
                    </div>

                    <div className="buffer-value-display">
                        <span className="value">{bufferTime}</span>
                        <span className="unit">minutes</span>
                    </div>

                    <div className="slider-container">
                        <input
                            type="range"
                            min="5"
                            max="60"
                            step="5"
                            value={bufferTime}
                            onChange={(e) => setBufferTime(e.target.value)}
                            className="buffer-slider"
                        />
                    </div>
                </div>
            </div>

            <div className="weekly-schedule-section">
                <div className="section-title">
                    <FaHistory className="section-icon" />
                    <h2>Weekly Schedule</h2>
                </div>

                <div className="schedule-grid">
                    {days.map(day => (
                        <DayScheduleCard
                            key={day}
                            day={day}
                            initialEnabled={day !== 'Wednesday' && day !== 'Weekend'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Slots;

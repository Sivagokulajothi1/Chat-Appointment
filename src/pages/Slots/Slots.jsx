import React, { useState, useEffect } from 'react';
import { FaSlidersH, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import DayScheduleCard from '../../components/DayScheduleCard/DayScheduleCard';
import './Slots.css';
import CustomMultiSelect from '../../components/CustomMultiSelect/CustomMultiSelect';
import { getDoctorsOnly } from '../../services/doctorSettings.service';
import { getAvailableSlots } from '../../services/slots.service';

const Slots = () => {
    const [slotDuration, setSlotDuration] = useState('30 min');
    const [concurrentBookings, setConcurrentBookings] = useState(1);
    const [bufferTime, setBufferTime] = useState(15);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekend'];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getDoctorsOnly();
                const doctors = Array.isArray(res.data) ? res.data : (res.data.doctors || res.data.rows || []);
                setDoctorOptions(
                    doctors.map((doc) => ({ value: String(doc.id), label: doc.name }))
                );
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            }
        };
        fetchDoctors();
        fetchSlots();
    }, []);

    // Fetch available slots whenever a doctor or date is selected
    useEffect(() => {
        if (selectedDoctors.length === 0 || !selectedDate) return;
        fetchSlots();
    }, [selectedDoctors, selectedDate]);

    const fetchSlots = async () => {
        try {
            const res = await getAvailableSlots();
            setAvailableSlots(res.data.slots || []);
        } catch (err) {
            console.error('Failed to fetch available slots:', err);
        }
    };
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
                                {['15 min', '30 min', '45 min', '60 min'].map(dur => (
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
                    <div style={{ width: "260px" }}>
                        <CustomMultiSelect
                            label="Doctor"
                            options={doctorOptions}
                            value={selectedDoctors}
                            onChange={setSelectedDoctors}
                            placeholder="Select doctors"
                        />
                    </div>
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

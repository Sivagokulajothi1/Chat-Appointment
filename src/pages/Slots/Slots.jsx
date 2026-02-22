import React, { useState, useEffect } from 'react';
import { FaSlidersH, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import DayScheduleCard from '../../components/DayScheduleCard/DayScheduleCard';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import { useToast } from '../../context/ToastContext';
import './Slots.css';
import { getDoctorsOnly } from '../../services/doctorSettings.service';
import {
    getDoctorSchedule,
    createDoctorSchedule,
    saveWeekSchedule,
} from '../../services/slots.service';

// 0=Sunday … 6=Saturday
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EMPTY_WEEK = DAY_NAMES.map((_, i) => ({
    day_of_week: i,
    is_working: i >= 1 && i <= 5,
    shifts: [{ start: '09:00', end: '17:00' }],
}));

const normaliseRows = (rows) =>
    DAY_NAMES.map((_, dow) => {
        const row = rows.find(r => r.day_of_week === dow);
        if (!row) return { day_of_week: dow, is_working: false, shifts: [] };
        return {
            day_of_week: row.day_of_week,
            is_working: row.is_working,
            shifts: Array.isArray(row.shifts) ? row.shifts : [],
        };
    });

const Slots = () => {
    const { showToast } = useToast();
    const [slotDuration, setSlotDuration] = useState('30 min');
    const [bufferTime, setBufferTime] = useState(15);
    const [concurrentBookings, setConcurrentBookings] = useState(1);

    // Doctor selector
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [activeDoctorId, setActiveDoctorId] = useState(null);

    const [schedule, setSchedule] = useState(EMPTY_WEEK);
    const [saving, setSaving] = useState(false);

    // ─── Load doctor list ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await getDoctorsOnly();
                const doctors = Array.isArray(res.data)
                    ? res.data
                    : (res.data.doctors || res.data.rows || []);
                setDoctorOptions(doctors.map(d => ({ value: String(d.id), label: d.name })));
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    // ─── Load default schedule on mount, pre-select that doctor ─────────────
    useEffect(() => {
        const loadDefault = async () => {
            try {
                const res = await getDoctorSchedule();
                const data = res.data;
                const defaultId = data.doctor_id ? String(data.doctor_id) : null;

                if (defaultId) {
                    setSelectedDoctor(defaultId);
                    setActiveDoctorId(defaultId);
                }

                const rows = data.schedule || [];
                if (rows.length > 0) setSchedule(normaliseRows(rows));
            } catch (err) {
                console.error('Failed to load default schedule:', err);
            }
        };
        loadDefault();
    }, []);

    // ─── Single doctor change ─────────────────────────────────────────────────
    const handleDoctorChange = async (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        setIsAllSelected(false);
        if (doctorId) {
            setActiveDoctorId(doctorId);
            await loadScheduleForDoctor(doctorId);
        }
    };

    // ─── All button ───────────────────────────────────────────────────────────
    const handleSelectAll = () => {
        setIsAllSelected(true);
        setSelectedDoctor('');
        // Load schedule of first doctor to display something
        if (doctorOptions.length > 0) {
            const firstId = String(doctorOptions[0].value);
            setActiveDoctorId(firstId);
            loadScheduleForDoctor(firstId);
        }
    };

    const loadScheduleForDoctor = async (doctorId) => {
        try {
            const res = await getDoctorSchedule(doctorId);
            let rows = res.data.schedule || [];

            if (rows.length === 0) {
                await createDoctorSchedule(Number(doctorId));
                const res2 = await getDoctorSchedule(doctorId);
                rows = res2.data.schedule || [];
            }

            if (rows.length > 0) setSchedule(normaliseRows(rows));
            else setSchedule(EMPTY_WEEK);
        } catch (err) {
            console.error('Failed to load schedule:', err);
        }
    };

    // ─── DayScheduleCard onChange ────────────────────────────────────────────
    const handleDayChange = (dayOfWeek, { is_working, shifts }) => {
        setSchedule(prev =>
            prev.map(d => d.day_of_week === dayOfWeek ? { ...d, is_working, shifts } : d)
        );
    };

    // ─── Save ────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        // Determine which doctor IDs to save for
        const idsToSave = isAllSelected
            ? doctorOptions.map(o => o.value)
            : activeDoctorId ? [activeDoctorId] : [];

        if (idsToSave.length === 0) return showToast('Please select a doctor first.', 'error');
        try {
            setSaving(true);
            const week = schedule.map(({ day_of_week, is_working, shifts }) => ({
                day_of_week, is_working, shifts,
            }));
            // Save for each selected doctor
            await Promise.all(idsToSave.map(id => saveWeekSchedule(id, week)));
            showToast('Schedule saved successfully!', 'success');
        } catch (err) {
            console.error('Save failed:', err);
            showToast(err?.response?.data?.message || 'Failed to save schedule.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const activeLabel = isAllSelected
        ? 'All Doctors'
        : doctorOptions.find(o => o.value === activeDoctorId)?.label || '';

    return (
        <div className="slot-config-page">
            <div className="slot-header-row">
                <div className="title-group">
                    <h1>Slot Configuration</h1>
                    <p>Design your operational window and automated booking rules.</p>
                </div>
                <div className="header-buttons">
                    {/* <button className="reset-btn" onClick={() => setSchedule(EMPTY_WEEK)}>
                        Reset to Defaults
                    </button> */}
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* <div className="config-grid">
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
                            type="range" min="5" max="60" step="5"
                            value={bufferTime}
                            onChange={(e) => setBufferTime(e.target.value)}
                            className="buffer-slider"
                        />
                    </div>
                </div>
            </div> */}

            <div className="weekly-schedule-section">
                <div className="section-title">
                    <FaHistory className="section-icon" />
                    <h2>
                        Weekly Schedule
                        {activeLabel && (
                            <span className="schedule-active-label">— {activeLabel}</span>
                        )}
                    </h2>

                    {/* Doctor selector row */}
                    <div className="doctor-selector-row">
                        <CustomSelect
                            options={doctorOptions}
                            value={selectedDoctor}
                            onChange={(val) => handleDoctorChange({ target: { value: val } })}
                            placeholder="Select Doctor"
                        />
                        <button
                            className={`all-doctors-btn ${isAllSelected ? 'active' : ''}`}
                            onClick={handleSelectAll}
                        >
                            All
                        </button>
                    </div>
                </div>

                <div className="schedule-grid">
                    {schedule.map(dayData => (
                        <DayScheduleCard
                            key={dayData.day_of_week}
                            day={DAY_NAMES[dayData.day_of_week]}
                            dayOfWeek={dayData.day_of_week}
                            isWorking={dayData.is_working}
                            shifts={dayData.shifts}
                            onChange={handleDayChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slots;

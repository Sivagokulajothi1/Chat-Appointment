import React from 'react';
import { FaClock, FaPlus, FaBan, FaTimes } from 'react-icons/fa';
import ToggleButton from '../ToggleButton/ToggleButton';
import './DayScheduleCard.css';

/**
 * Props:
 *  day        - string label e.g. "Monday"
 *  dayOfWeek  - number 0–6 (0=Sunday)
 *  isWorking  - bool (controlled)
 *  shifts     - array of { start:"HH:MM", end:"HH:MM" }
 *  onChange   - (dayOfWeek, { is_working, shifts }) => void
 */
const DayScheduleCard = ({ day, dayOfWeek, isWorking, shifts = [], onChange }) => {

    const handleToggle = () => {
        onChange(dayOfWeek, { is_working: !isWorking, shifts });
    };

    const handleShiftChange = (index, field, value) => {
        const updated = shifts.map((s, i) => i === index ? { ...s, [field]: value } : s);
        onChange(dayOfWeek, { is_working: isWorking, shifts: updated });
    };

    const handleAddShift = () => {
        onChange(dayOfWeek, {
            is_working: isWorking,
            shifts: [...shifts, { start: '09:00', end: '17:00' }],
        });
    };

    const handleDeleteShift = (index) => {
        const updated = shifts.filter((_, i) => i !== index);
        onChange(dayOfWeek, { is_working: isWorking, shifts: updated });
    };

    return (
        <div className={`day-card ${!isWorking ? 'disabled' : ''}`}>
            <div className="day-card-header">
                <h3>{day}</h3>
                <div className="header-right">
                    {!isWorking && (dayOfWeek === 0 || dayOfWeek === 6) && (
                        <span className="closed-badge">STANDARD CLOSED</span>
                    )}
                    <ToggleButton isOn={isWorking} handleToggle={handleToggle} />
                </div>
            </div>

            <div className="day-card-content">
                {isWorking ? (
                    <>
                        <div className="slots-list">
                            {shifts.map((shift, index) => (
                                <div key={index} className="slot-item">
                                    <div className="time-input-group">
                                        <span className="input-label">START</span>
                                        <div className="time-picker">
                                            <input
                                                type="time"
                                                value={shift.start}
                                                onChange={(e) => handleShiftChange(index, 'start', e.target.value)}
                                            />
                                            <FaClock className="clock-icon" />
                                        </div>
                                    </div>
                                    <div className="slot-divider">–</div>
                                    <div className="time-input-group">
                                        <span className="input-label">END</span>
                                        <div className="time-picker">
                                            <input
                                                type="time"
                                                value={shift.end}
                                                onChange={(e) => handleShiftChange(index, 'end', e.target.value)}
                                            />
                                            <FaClock className="clock-icon" />
                                        </div>
                                    </div>
                                    <button
                                        className="delete-shift-btn"
                                        title="Remove shift"
                                        onClick={() => handleDeleteShift(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="add-shift-btn" onClick={handleAddShift}>
                            <FaPlus className="plus-icon" /> Add Break/Shift
                        </button>
                    </>
                ) : (
                    <div className="closed-state">
                        <div className="closed-icon-container">
                            {(dayOfWeek === 0 || dayOfWeek === 6) ? (
                                <p className="weekend-text">
                                    No recurring slots are currently active for Saturday and Sunday
                                </p>
                            ) : (
                                <>
                                    <div className="office-closed-icon"><FaBan /></div>
                                    <p>OFFICE CLOSED</p>
                                </>
                            )}
                        </div>
                        {(dayOfWeek === 0 || dayOfWeek === 6) && (
                            <button className="enable-weekend-btn" onClick={handleToggle}>
                                Enable Weekend Booking
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayScheduleCard;

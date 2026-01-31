import React, { useState } from 'react';
import { FaClock, FaPlus, FaBan } from 'react-icons/fa';
import ToggleButton from '../ToggleButton/ToggleButton';
import './DayScheduleCard.css';

const DayScheduleCard = ({ day, initialEnabled = true, initialSlots = [] }) => {
    const [isEnabled, setIsEnabled] = useState(initialEnabled);
    const [slots, setSlots] = useState(initialSlots.length > 0 ? initialSlots : [{ start: '09:00 AM', end: '05:00 PM' }]);

    const toggleDay = () => setIsEnabled(!isEnabled);

    const addSlot = () => {
        if (isEnabled) {
            setSlots([...slots, { start: '09:00 AM', end: '05:00 PM' }]);
        }
    };

    return (
        <div className={`day-card ${!isEnabled ? 'disabled' : ''}`}>
            <div className="day-card-header">
                <h3>{day}</h3>
                <div className="header-right">
                    {!isEnabled && day === 'Weekend' && <span className="closed-badge">STANDARD CLOSED</span>}
                    <ToggleButton isOn={isEnabled} handleToggle={toggleDay} />
                </div>
            </div>

            <div className="day-card-content">
                {isEnabled ? (
                    <>
                        <div className="slots-list">
                            {slots.map((slot, index) => (
                                <div key={index} className="slot-item">
                                    <div className="time-input-group">
                                        <span className="input-label">START</span>
                                        <div className="time-picker">
                                            <span>{slot.start}</span>
                                            <FaClock className="clock-icon" />
                                        </div>
                                    </div>
                                    <div className="slot-divider">–</div>
                                    <div className="time-input-group">
                                        <span className="input-label">END</span>
                                        <div className="time-picker">
                                            <span>{slot.end}</span>
                                            <FaClock className="clock-icon" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="add-shift-btn" onClick={addSlot}>
                            <FaPlus className="plus-icon" /> Add Break/Shift
                        </button>
                    </>
                ) : (
                    <div className="closed-state">
                        <div className="closed-icon-container">
                            {day === 'Weekend' ? (
                                <p className="weekend-text">No recurring slots are currently active for Saturday and Sunday</p>
                            ) : (
                                <>
                                    <div className="office-closed-icon">
                                        <FaBan />
                                    </div>
                                    <p>OFFICE CLOSED</p>
                                </>
                            )}
                        </div>
                        {day === 'Weekend' && (
                            <button className="enable-weekend-btn" onClick={toggleDay}>
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

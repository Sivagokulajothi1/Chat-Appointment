import React from 'react';
import './ToggleButton.css';

const ToggleButton = ({ isOn, handleToggle }) => {
    return (
        <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
            <div className="toggle-thumb" />
        </div>
    );
};

export default ToggleButton;

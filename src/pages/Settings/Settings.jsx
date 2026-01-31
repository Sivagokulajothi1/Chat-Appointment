import React, { useState } from 'react';
import { FaBuilding, FaPhone, FaMapMarkerAlt, FaCommentDots, FaEye, FaEyeSlash, FaQuestionCircle, FaBell } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
    const [showToken, setShowToken] = useState(false);
    const [clinicInfo, setClinicInfo] = useState({
        name: 'City Health Specialists',
        phone: '+1 (555) 123-4567',
        address: '123 Medical Plaza, Suite 400, New York, NY 10001'
    });
    const [twilioSettings, setTwilioSettings] = useState({
        sid: 'AC7728f34384e55648821990234e90',
        token: '1234567890abcdef1234567890abcdef',
        number: 'whatsapp:+14155552671'
    });
    const [saveStatus, setSaveStatus] = useState(null);

    const handleClinicSave = (e) => {
        e.preventDefault();
        setSaveStatus('Clinic info saved successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleTwilioSave = (e) => {
        e.preventDefault();
        setSaveStatus('Twilio credentials updated!');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="breadcrumb">
                    <span>Dashboard</span> / <span>Settings</span>
                </div>
                <div className="settings-title-row">
                    <div className="title-group">
                        <h1>System Settings</h1>
                        <p>Manage your clinic identity and connect third-party communication and calendar services.</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn-gray"><FaBell /></button>
                        <button className="icon-btn-gray"><FaQuestionCircle /></button>
                    </div>
                </div>
            </div>

            {saveStatus && <div className="save-notification">{saveStatus}</div>}

            <div className="settings-content">
                {/* Clinic Information Card */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-left">
                            <FaBuilding className="header-icon" />
                            <h3>Clinic Information</h3>
                        </div>
                    </div>
                    <form className="card-body" onSubmit={handleClinicSave}>
                        <div className="form-row-2col">
                            <div className="form-group">
                                <label>Clinic Name</label>
                                <input
                                    type="text"
                                    value={clinicInfo.name}
                                    onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                                    placeholder="Enter clinic name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={clinicInfo.phone}
                                    onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Physical Address</label>
                            <input
                                type="text"
                                value={clinicInfo.address}
                                onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                                placeholder="Enter physical address"
                            />
                        </div>
                        <div className="card-actions">
                            <button type="submit" className="btn-primary-green">Save Changes</button>
                        </div>
                    </form>
                </div>

                {/* Twilio API Settings Card */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-left">
                            <FaCommentDots className="header-icon" />
                            <h3>Twilio API Settings</h3>
                        </div>
                        <span className="status-badge-active">ACTIVE</span>
                    </div>
                    <form className="card-body" onSubmit={handleTwilioSave}>
                        <div className="form-group">
                            <label>Account SID</label>
                            <input
                                type="text"
                                value={twilioSettings.sid}
                                onChange={(e) => setTwilioSettings({ ...twilioSettings, sid: e.target.value })}
                                placeholder="Enter Account SID"
                            />
                        </div>
                        <div className="form-row-2col">
                            <div className="form-group">
                                <label>Auth Token</label>
                                <div className="input-with-icon">
                                    <input
                                        type={showToken ? "text" : "password"}
                                        value={twilioSettings.token}
                                        onChange={(e) => setTwilioSettings({ ...twilioSettings, token: e.target.value })}
                                        placeholder="Enter Auth Token"
                                    />
                                    <button type="button" className="toggle-visibility" onClick={() => setShowToken(!showToken)}>
                                        {showToken ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={twilioSettings.number}
                                    onChange={(e) => setTwilioSettings({ ...twilioSettings, number: e.target.value })}
                                    placeholder="Enter WhatsApp Number"
                                />
                            </div>
                        </div>
                        <div className="card-actions">
                            <button type="submit" className="btn-primary-green">Update Credentials</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;

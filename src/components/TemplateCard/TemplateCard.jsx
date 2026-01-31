import React, { useState } from 'react';
import { FaEdit, FaCopy, FaTrash} from 'react-icons/fa';
import './TemplateCard.css';

const TemplateCard = ({ template }) => {
    const [isActive, setIsActive] = useState(template.status === 'ACTIVE');

    const toggleStatus = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={`template-card ${!isActive ? 'draft' : ''}`}>
            <div className="card-top">
                <div className="template-icon-container" style={{ backgroundColor: template.bgColor }}>
                    <span className="template-icon">{template.icon}</span>
                </div>
                <div className="template-header">
                    <div className="title-row">
                        <h3>{template.name}</h3>
                        <span className={`status-badge ${isActive ? 'active' : 'draft'}`} onClick={toggleStatus}>
                            {isActive ? 'ACTIVE' : 'DRAFT'}
                        </span>
                    </div>
                    <p className="category">CATEGORY: {template.category}</p>
                </div>
            </div>

            <div className="card-body">
                <div className="message-preview">
                    {template.preview}
                </div>
            </div>

            <div className="card-footer">
                <div className="footer-left">
                    <span className="last-edited">{template.lastEdited}</span>
                </div>
                <div className="footer-actions">
                    <button className="icon-btn" title="Edit"><FaEdit /></button>
                    <button className="icon-btn" title="Copy"><FaCopy /></button>
                    <button className="icon-btn delete" title="Delete"><FaTrash /></button>
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;

import React, { useState } from 'react';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import './TemplateCard.css';

const TemplateCard = ({ template }) => {
    // API returns is_active (bool); local toggle overrides it visually
    const [isActive, setIsActive] = useState(
        template.is_active !== undefined ? template.is_active : template.status === 'ACTIVE'
    );

    const toggleStatus = () => {
        setIsActive(!isActive);
    };

    // Map API fields → display fields
    const title = template.name || template.key || '—';
    const category = template.category || '—';
    const preview = template.preview || template.content || '';
    const lastEdited = template.lastEdited
        ? template.lastEdited
        : template.created_at
            ? new Date(template.created_at).toLocaleDateString()
            : '';

    return (
        <div className={`template-card ${!isActive ? 'draft' : ''}`}>
            <div className="card-top">
                <div className="template-icon-container" style={{ backgroundColor: template.bgColor }}>
                    <span className="template-icon">{template.icon || '📋'}</span>
                </div>
                <div className="template-header">
                    <div className="title-row">
                        <h3>{title}</h3>
                        <span className={`status-badge ${isActive ? 'active' : 'draft'}`} onClick={toggleStatus}>
                            {isActive ? 'ACTIVE' : 'DRAFT'}
                        </span>
                    </div>
                    <p className="category">CATEGORY: {category}</p>
                </div>
            </div>

            <div className="card-body">
                <div className="message-preview">
                    {preview}
                </div>
            </div>

            <div className="card-footer">
                <div className="footer-left">
                    <span className="last-edited">{lastEdited}</span>
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

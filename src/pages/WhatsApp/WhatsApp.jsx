import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaBell, FaThLarge, FaList } from 'react-icons/fa';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import CustomModal from '../../components/CustomModal/CustomModal';
import {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from '../../services/templates.service';
import './WhatsApp.css';

const WhatsApp = () => {
    const [activeTab, setActiveTab] = useState('All Templates');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'ONBOARDING',
        message: '',
        icon: '✨'
    });
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Load templates from API on mount
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await getTemplates();
            const data = res.data;
            const list = Array.isArray(data) ? data : (data.templates || data.rows || []);
            setTemplates(list);
        } catch (err) {
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'TOTAL TEMPLATES', value: '12', change: '~8%', color: '#39df79' },
        { label: 'ACTIVE AUTOMATIONS', value: '04', change: 'Steady', color: '#39df79' },
        { label: 'DELIVERY RATE', value: '99.2%', change: 'Excellent', color: '#16a34a' }
    ];

    const tabs = ['All Templates', 'Onboarding', 'Scheduling', 'Reminders'];

    const filteredTemplates = templates.filter(template => {
        const key = (template.key || '').toLowerCase();
        const content = (template.content || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        const matchesSearch = key.includes(query) || content.includes(query);
        const matchesTab = activeTab === 'All Templates' || key.includes(activeTab.toLowerCase());
        return matchesSearch && matchesTab;
    });

    const handleOpenModal = () => {
        setFormData({
            name: '',
            category: 'ONBOARDING',
            message: '',
            icon: '✨'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                message: formData.message,
                icon: formData.icon,
                status: 'DRAFT',
            };
            await createTemplate(payload);
            // Refresh list after creation
            fetchTemplates();
            handleCloseModal();
        } catch (err) {
            console.error('Create template failed:', err);
            alert(err?.response?.data?.message || 'Failed to create template');
        }
    };

    // ✅ Delete a template
    const handleDeleteTemplate = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await deleteTemplate(id);
            fetchTemplates();
        } catch (err) {
            console.error('Delete failed:', err);
            alert(err?.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="whatsapp-templates-page">
            <div className="whatsapp-header">
                <div className="header-left">
                    <h1>WhatsApp Templates</h1>
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="header-right">
                    <button className="notification-btn"><FaBell /></button>
                    <button className="create-template-btn" onClick={handleOpenModal}>
                        <FaPlus /> Create Template
                    </button>
                </div>
            </div>

            <div className="whatsapp-stats-row">
                {stats.map((stat, index) => (
                    <div key={index} className="wa-stat-card">
                        <p className="wa-stat-label">{stat.label}</p>
                        <div className="wa-stat-value-row">
                            <span className="wa-stat-value">{stat.value}</span>
                            <span className="wa-stat-change" style={{ color: stat.color }}>
                                {stat.change.includes('~') ? <span style={{ fontSize: '0.8em' }}>↑</span> : ''} {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="whatsapp-toolbar">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="view-toggle">
                    <button className="view-btn active"><FaThLarge /></button>
                    <button className="view-btn"><FaList /></button>
                </div>
            </div>

            <div className="templates-grid">
                {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                ))}

                <div className="add-template-card" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                    <div className="add-icon-container">
                        <FaPlus />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>Add New Template</p>
                </div>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Create New WhatsApp Template"
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Template Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Appointment Reminder"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="ONBOARDING">Onboarding</option>
                            <option value="SCHEDULING">Scheduling</option>
                            <option value="ALERTS">Alerts</option>
                            <option value="REMINDERS">Reminders</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Icon (Emoji)</label>
                        <input
                            type="text"
                            placeholder="e.g. 📅"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Message Preview</label>
                        <textarea
                            placeholder="Type your message preview here..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                        <button type="submit" className="btn-primary">Create Template</button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default WhatsApp;

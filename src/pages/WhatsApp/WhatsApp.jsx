import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaBell, FaThLarge, FaList } from 'react-icons/fa';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import CustomModal from '../../components/CustomModal/CustomModal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from '../../services/templates.service';
import './WhatsApp.css';

const INITIAL_FORM = { key: '', content: '', icon: '✨', is_active: true };

const WhatsApp = () => {
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('All Templates');
    const [searchQuery, setSearchQuery] = useState('');
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Create / Edit modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);

    // Delete confirmation dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    useEffect(() => { fetchTemplates(); }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await getTemplates();
            const data = res.data;
            setTemplates(Array.isArray(data) ? data : (data.templates || data.rows || []));
        } catch (err) {
            console.error('Failed to fetch templates:', err);
            showToast('Failed to load templates', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Tab filtering ────────────────────────────────────────────────────────
    const tabs = ['All Templates', 'Onboarding', 'Scheduling', 'Reminders'];

    const filteredTemplates = templates.filter(template => {
        const key = (template.key || '').toLowerCase();
        const content = (template.content || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        const matchesSearch = key.includes(query) || content.includes(query);
        const matchesTab = activeTab === 'All Templates' || key.includes(activeTab.toLowerCase());
        return matchesSearch && matchesTab;
    });

    // ── Create modal ─────────────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setEditingTemplate(null);
        setFormData(INITIAL_FORM);
        setIsModalOpen(true);
    };

    // ── Edit modal ───────────────────────────────────────────────────────────
    const handleOpenEdit = (template) => {
        setEditingTemplate(template);
        setFormData({
            key: template.key || '',
            content: template.content || '',
            icon: template.icon || '✨',
            is_active: template.is_active ?? true,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
    };

    // ── Submit (create or update) ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                key: formData.key,
                content: formData.content,
                icon: formData.icon,
                is_active: formData.is_active,
            };

            if (editingTemplate) {
                await updateTemplate(editingTemplate.id, payload);
                showToast('Template updated successfully', 'success');
            } else {
                await createTemplate(payload);
                showToast('Template created successfully', 'success');
            }
            fetchTemplates();
            handleCloseModal();
        } catch (err) {
            console.error('Save failed:', err);
            showToast(err?.response?.data?.message || 'Failed to save template', 'error');
        }
    };

    // ── Delete  (opens confirm dialog) ───────────────────────────────────────
    const handleDeleteClick = (id) => {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        try {
            await deleteTemplate(pendingDeleteId);
            showToast('Template deleted', 'success');
            fetchTemplates();
        } catch (err) {
            console.error('Delete failed:', err);
            showToast(err?.response?.data?.message || 'Delete failed', 'error');
        } finally {
            setPendingDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

    // ── Copy content to clipboard ────────────────────────────────────────────
    const handleCopyTemplate = (template) => {
        const text = template.content || template.key || '';
        navigator.clipboard
            .writeText(text)
            .then(() => showToast('Copied to clipboard ✓', 'success'))
            .catch(() => showToast('Failed to copy', 'error'));
    };

    // ── Derived stats ────────────────────────────────────────────────────────
    const stats = [
        { label: 'TOTAL TEMPLATES', value: String(templates.length), change: '~8%', color: '#39df79' },
        { label: 'ACTIVE AUTOMATIONS', value: String(templates.filter(t => t.is_active).length), change: 'Steady', color: '#39df79' },
        { label: 'DELIVERY RATE', value: '99.2%', change: 'Excellent', color: '#16a34a' },
    ];

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
                    <button className="create-template-btn" onClick={handleOpenCreate}>
                        <FaPlus /> Create Template
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="whatsapp-stats-row">
                {stats.map((stat, i) => (
                    <div key={i} className="wa-stat-card">
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

            {/* Tabs */}
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
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid view"
                    ><FaThLarge /></button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List view"
                    ><FaList /></button>
                </div>
            </div>

            {/* Grid */}
            <div className={viewMode === 'list' ? 'templates-list' : 'templates-grid'}>
                {loading ? (
                    <p style={{ color: '#6b7280', padding: '1rem' }}>Loading templates…</p>
                ) : (
                    filteredTemplates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onEdit={() => handleOpenEdit(template)}
                            onDelete={() => handleDeleteClick(template.id)}
                            onCopy={() => handleCopyTemplate(template)}
                        />
                    ))
                )}

                <div className="add-template-card" onClick={handleOpenCreate} style={{ cursor: 'pointer' }}>
                    <div className="add-icon-container"><FaPlus /></div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        Add New Template
                    </p>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTemplate ? 'Edit Template' : 'Create New WhatsApp Template'}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Template Key</label>
                        <input
                            type="text"
                            placeholder="e.g. WELCOME"
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            required
                        />
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
                        <label>Message Content</label>
                        <textarea
                            placeholder="Type your message here…"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem',
                            }}
                        />
                    </div>
                    <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                        <label style={{ margin: 0 }}>Active</label>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingTemplate ? 'Update Template' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </CustomModal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmOpen}
                type="danger"
                title="Delete Template"
                message="Are you sure you want to delete this template? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default WhatsApp;

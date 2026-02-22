import React, { useState, useEffect, useRef, useMemo } from 'react';
import './CustomSelect.css';

/**
 * CustomSelect — Searchable single-select dropdown
 *
 * Props:
 *  options      - [{ value, label, subtitle? }]
 *  value        - currently selected value (string)
 *  onChange     - (value) => void
 *  placeholder  - string shown when nothing is selected
 *  disabled     - bool
 */
export default function CustomSelect({
    options = [],
    value = '',
    onChange,
    placeholder = 'Select...',
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapRef = useRef(null);
    const searchRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Auto-focus search when dropdown opens
    useEffect(() => {
        if (open && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return options;
        return options.filter(o =>
            String(o.label).toLowerCase().includes(q) ||
            String(o.subtitle || '').toLowerCase().includes(q)
        );
    }, [options, query]);

    const selectedOption = options.find(o => String(o.value) === String(value));

    const handleSelect = (opt) => {
        onChange?.(opt.value);
        setOpen(false);
        setQuery('');
    };

    const handleToggle = () => {
        if (disabled) return;
        setOpen(p => !p);
        if (!open) setQuery('');
    };

    return (
        <div
            className={`cs-wrap ${disabled ? 'cs-disabled' : ''} ${open ? 'cs-open' : ''}`}
            ref={wrapRef}
        >
            {/* Trigger */}
            <button
                type="button"
                className="cs-trigger"
                onClick={handleToggle}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {selectedOption ? (
                    <span className="cs-selected-label">
                        <span className="cs-avatar">{selectedOption.label.charAt(0).toUpperCase()}</span>
                        {selectedOption.label}
                    </span>
                ) : (
                    <span className="cs-placeholder">{placeholder}</span>
                )}
                <span className={`cs-chevron ${open ? 'up' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="cs-panel" role="listbox">
                    {/* Search */}
                    <div className="cs-search-box">
                        <svg className="cs-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.8" />
                            <path d="M11 11L14 14" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <input
                            ref={searchRef}
                            className="cs-search-input"
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                className="cs-search-clear"
                                onClick={() => setQuery('')}
                                tabIndex={-1}
                            >✕</button>
                        )}
                    </div>

                    {/* Options list */}
                    <ul className="cs-list">
                        {filtered.length === 0 ? (
                            <li className="cs-empty">No results found</li>
                        ) : (
                            filtered.map(opt => {
                                const isActive = String(opt.value) === String(value);
                                return (
                                    <li
                                        key={opt.value}
                                        className={`cs-item ${isActive ? 'cs-item-active' : ''}`}
                                        role="option"
                                        aria-selected={isActive}
                                        onClick={() => handleSelect(opt)}
                                    >
                                        <span className={`cs-item-avatar ${isActive ? 'active' : ''}`}>
                                            {opt.label.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="cs-item-text">
                                            <span className="cs-item-label">{opt.label}</span>
                                            {opt.subtitle && (
                                                <span className="cs-item-subtitle">{opt.subtitle}</span>
                                            )}
                                        </span>
                                        {isActive && (
                                            <svg className="cs-item-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2.5 7L5.5 10L11.5 4" stroke="#39df79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

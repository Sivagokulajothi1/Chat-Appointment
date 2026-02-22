import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CustomMultiSelect.css";

export default function CustomMultiSelect({
  label = "Select",
  options = [],              // [{ value:"cardio", label:"Cardiology" }]
  value = [],                // ["cardio","neuro"]
  onChange,                  // (newValues)=>{}
  placeholder = "Select...",
  searchable = true,
  disabled = false,
  closeOnSelect = false,
  showSelectAll = true,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedSet = useMemo(() => new Set(value || []), [value]);

  const filtered = useMemo(() => {
    if (!searchable || !q.trim()) return options;
    const s = q.toLowerCase();
    return options.filter((o) => String(o.label).toLowerCase().includes(s));
  }, [options, q, searchable]);

  const toggle = (v) => {
    if (disabled) return;
    const next = new Set(selectedSet);
    if (next.has(v)) next.delete(v);
    else next.add(v);

    const arr = Array.from(next);
    onChange?.(arr);

    if (closeOnSelect) setOpen(false);
  };

  const removeChip = (v) => {
    if (disabled) return;
    const next = value.filter((x) => x !== v);
    onChange?.(next);
  };

  const clearAll = () => {
    if (disabled) return;
    onChange?.([]);
  };

  const selectAll = () => {
    if (disabled) return;
    onChange?.(options.map((o) => o.value));
  };

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return (value || []).map((v) => ({ value: v, label: map.get(v) || v }));
  }, [value, options]);

  const allSelected = options.length > 0 && value?.length === options.length;

  return (
    <div className={`cms-wrap ${disabled ? "is-disabled" : ""}`} ref={wrapRef}>
      {label ? <div className="cms-label">{label}</div> : null}

      <div
        className={`cms-control ${open ? "is-open" : ""}`}
        onClick={() => !disabled && setOpen((p) => !p)}
        role="button"
        tabIndex={0}
      >
        <div className="cms-chips">
          {selectedLabels.length === 0 ? (
            <span className="cms-placeholder">{placeholder}</span>
          ) : (
            selectedLabels.map((s) => (
              <span className="cms-chip" key={s.value} onClick={(e) => e.stopPropagation()}>
                {s.label}
                <button
                  type="button"
                  className="cms-chip-x"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(s.value);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        <span className="cms-arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="cms-menu" onClick={(e) => e.stopPropagation()}>
          {searchable && (
            <div className="cms-search">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
              />
            </div>
          )}

          <div className="cms-actions">
            {showSelectAll && (
              <button type="button" onClick={allSelected ? clearAll : selectAll}>
                {allSelected ? "Clear All" : "Select All"}
              </button>
            )}
            {!showSelectAll && (
              <button type="button" onClick={clearAll}>Clear</button>
            )}
          </div>

          <div className="cms-list">
            {filtered.length === 0 ? (
              <div className="cms-empty">No options</div>
            ) : (
              filtered.map((o) => {
                const checked = selectedSet.has(o.value);
                return (
                  <label className="cms-item" key={o.value}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(o.value)}
                    />
                    <span>{o.label}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import "./Filter.css";

const Filter = ({ data = [], onFilter }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const boxRef = useRef(null);

  // ✅ Filter logic
  const filtered = useMemo(() => {
    let out = [...data];

    if (name.trim()) {
      const q = name.toLowerCase();
      out = out.filter((u) => (u.name || "").toLowerCase().includes(q));
    }

    if (role) out = out.filter((u) => u.role === role);
    if (status) out = out.filter((u) => u.status === status);

    return out;
  }, [data, name, role, status]);

  // Send filtered data
  useEffect(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearAll = () => {
    setName("");
    setRole("");
    setStatus("");
  };

  return (
    <div className="filter-container" ref={boxRef}>
      {/* Button */}
      <button className="filter-btn" onClick={() => setShow(!show)}>
        <FaFilter /> Filters
      </button>

      {/* Popup */}
      {show && (
        <div className="filter-popup">
          <div className="filter-header">
            <h4>Filters</h4>
            <button className="close-btn" onClick={() => setShow(false)}>
              ✕
            </button>
          </div>

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Search name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">All</option>
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button className="clear" onClick={clearAll}>
              Clear
            </button>
            <button className="done" onClick={() => setShow(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;

import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './doctors.css';
import { createDoctorSettings, getDoctorSettingsList, getDoctorsOnly, updateDoctorSettings } from '../../services/doctorSettings.service';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [doctorslist, setDoctorslist] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const initialDoctorModel = {
        name: "",          // Full Name
        dept: "Cardiology", // Default department
        startTime: "",     // Example: "09:00"
        endTime: "",       // Example: "17:00"
        slot: "15 min"     // "10 min" | "15 min" | "30 min"
    };

    const [formData, setFormData] = useState(initialDoctorModel);

    useEffect(() => {
        if (editingDoctor) {
            setFormData({
                name: editingDoctor.name,
                dept: editingDoctor.dept,
                startTime: editingDoctor.startTime,
                endTime: editingDoctor.endTime,
                slot: editingDoctor.slot
            });
        } else {
            setFormData(initialDoctorModel);
        }
    }, [editingDoctor]);

    useEffect(() => {
        fetchDoctorSettings();
    }, []);

    const fetchDoctorSettings = async () => {
        try {
            const res = await getDoctorSettingsList();
            setDoctors(res.data.rows || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchDoctors();
        }
    }, [isModalOpen]);

    const fetchDoctors = async () => {
        try {
            const res = await getDoctorsOnly();
            setDoctorslist(Array.isArray(res.data) ? res.data : (res.data.doctors || res.data.rows || []));
        } catch (err) {
            console.error(err);
        }
    };

    const headers = ['DOCTOR NAME', 'DEPARTMENT', 'WORKING TIME', 'SLOT', 'STATUS', 'ACTIONS'];

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setEditingDoctor(doctor);
            console.log(doctor, "doctor");
            // ✅ backend row shape
            const start = doctor?.work_start?.slice?.(0, 5) || "09:00";
            const end = doctor?.work_end?.slice?.(0, 5) || "17:00";

            // Extract slot minutes safely, fallback to 15
            const rawSlot = doctor?.slot_minutes || doctor?.staff?.slot_minutes || 15;
            const formattedSlot = `${rawSlot} min`;

            setFormData({
                doctorId: doctor?.doctor_staff_id || doctor?.staff?.id || "",
                name: doctor?.staff?.name || doctor?.name || "",
                dept: doctor?.staff?.Specification || doctor?.dept || "Cardiology",
                startTime: start,
                endTime: end,
                slot: formattedSlot,
                status: doctor?.status ? doctor.status.toUpperCase() : (doctor?.is_active ? "ACTIVE" : "INACTIVE"),
            });
        } else {
            setEditingDoctor(null);
            setFormData({
                doctorId: "",
                name: "",
                dept: "Cardiology",
                startTime: "09:00",
                endTime: "17:00",
                slot: "15 min",
                status: "ACTIVE",
            });
        }

        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDoctor(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            setDoctors(doctors.filter(d => d.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ✅ convert "15 min" -> 15
            const slot_minutes = parseInt(String(formData.slot), 10);

            const payload = {
                doctor_staff_id: Number(formData.doctorId), // selected doctor from dropdown
                work_start: formData.startTime,
                work_end: formData.endTime,
                slot_minutes,
                status: formData.status.toLowerCase(), // Convert to active/inactive/leave
            };

            if (editingDoctor?.id) {
                // ✅ EDIT
                await updateDoctorSettings(editingDoctor.id, payload);
            } else {
                // ✅ CREATE
                await createDoctorSettings(payload);
            }

            // ✅ refresh table list from backend
            const res = await getDoctorSettingsList();
            setDoctors(res.data.rows); // assuming your table uses rows from backend

            handleCloseModal();
        } catch (err) {
            alert(err?.response?.data?.message || "Save failed");
            console.error(err);
        }
    };
    const filteredDoctors = doctors.filter((d) => {
        const name = (d?.staff?.name || "").toLowerCase();
        const dept = (d?.staff?.Specification || "").toLowerCase();
        const q = searchQuery.toLowerCase();
        return name.includes(q) || dept.includes(q);
    });



    const handleExport = () => {
        const csvContent = [
            ['Name', 'Department', 'Working Hours', 'Slot Duration', 'Status'],
            ...doctors.map(d => [d.name, d.dept, d.time, d.slot, d.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `doctors_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderRow = (row) => {
        const name = row?.staff?.name || "";
        const dept = row?.staff?.Specification || "";
        const time = `${row.work_start.slice(0, 5)} - ${row.work_end.slice(0, 5)}`;
        const slot = `${row.slot_minutes} min`;
        const status = row.status ? row.status.toUpperCase() : (row.is_active ? "ACTIVE" : "INACTIVE");

        return (
            <tr key={row.id}>
                <td>{name}</td>
                <td><span className="dept-tag">{dept}</span></td>
                <td>{time}</td>
                <td>{slot}</td>
                <td>
                    <span className={`status-pill ${status.toLowerCase()}`}>
                        {status}
                    </span>
                </td>
                <td>
                    <div className="action-buttons">
                        <button className="icon-btn-small" title="Edit" onClick={() => handleOpenModal(row)}><FaEdit /></button>
                        {/* <button className="icon-btn-small delete" title="Delete" onClick={() => handleDelete(doctor.id)}><FaTrash /></button> */}
                    </div>
                </td>
            </tr>
        );
    };


    return (
        <div className="doctors-page">
            <div className="page-header-row">
                <div className="title-section">
                    <h1>Doctor Management</h1>
                    <p>Manage healthcare professionals and their schedules <span className="count-badge">{doctors.length} TOTAL DOCTORS</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus />  Add New Doctor
                </button>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="action-group" style={{ display: 'flex', gap: '0.75rem' }}>
                    {/* <button className="filter-btn" onClick={handleFilter}>
                        <FaFilter /> Filters
                    </button> */}
                    <button className="export-btn-gray" onClick={handleExport} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '0.75rem 1.25rem', borderRadius: '10px', color: '#4b5563', fontSize: '0.9375rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            <div className="table-wrapper-card">
                <CustomTable headers={headers} data={filteredDoctors} renderRow={renderRow} />
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* ✅ Doctor dropdown */}
                    <div className="form-group">
                        <label>Doctor</label>
                        <select
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctorslist.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ✅ Department (optional: auto show from doctor selection) */}
                    <div className="form-group">
                        <label>Department</label>
                        <select
                            value={formData.dept}
                            onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                        >
                            <option>Cardiology</option>
                            <option>Pediatrics</option>
                            <option>Neurology</option>
                            <option>General Practice</option>
                            <option>Dermatology</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Slot Duration</label>
                        <div className="radio-group">
                            {["10 min", "15 min", "30 min"].map((s) => (
                                <label key={s}>
                                    <input
                                        type="radio"
                                        name="slot"
                                        checked={formData.slot === s}
                                        onChange={() => setFormData({ ...formData, slot: s })}
                                    />
                                    {s}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Status dropdown */}
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="LEAVE">Leave</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingDoctor ? "Update Doctor" : "Save Doctor"}
                        </button>
                    </div>
                </form>
            </CustomModal>

        </div>
    );
};

export default Doctors;

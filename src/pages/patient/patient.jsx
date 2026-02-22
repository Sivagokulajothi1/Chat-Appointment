import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './patient.css';
import { createPatient, deletePatient, getPatients, updatePatient } from '../../services/patients.service';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

const Patient = () => {
    const { showToast } = useToast();

    const [patient, setPatient] = useState([]);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewPatient, setViewPatient] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        phone: "",
        name: "",
        email: "",
        dob: "",
        address: "",
        gender: "Male",
    });

    useEffect(() => {
        fetchPatients();
    }, []);


    const headers = ["PATIENT NAME", "PHONE", "EMAIL", "DOB", "GENDER", "ACTIONS"];

    const handleRowDoubleClick = (patient) => {
        setViewPatient(patient);
        setViewModalOpen(true);
    };

    const closeViewModal = () => {
        setViewModalOpen(false);
        setViewPatient(null);
    };

    const handleOpenModal = (patientItem = null) => {
        if (patientItem) {
            setEditingPatient(patientItem);
            setFormData({
                phone: patientItem.phone || "",
                name: patientItem.name || "",
                email: patientItem.email || "",
                dob: patientItem.dob ? patientItem.dob.slice(0, 10) : "",
                address: patientItem.address || "",
                gender: patientItem.gender || "Male",
            });
        } else {
            setEditingPatient(null);
            setFormData({
                phone: "",
                name: "",
                email: "",
                dob: "",
                address: "",
                gender: "Male",
            });
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
        setFormData({
            phone: "",
            name: "",
            email: "",
            dob: "",
            address: "",
            gender: "Male",
        });
    };


    const handleDelete = (id) => {
        setSelectedId(id);
        setDeleteDialog(true);
    };


    const confirmDelete = async () => {
        try {
            await deletePatient(selectedId);
            showToast("Patient deleted successfully", "success");
            fetchPatients();
        } catch (error) {
            showToast(
                error?.response?.data?.message || "Failed to delete Patient",
                "error"
            );
        } finally {
            setDeleteDialog(false);
            setSelectedId(null);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingPatient) {
                await updatePatient(editingPatient.id, formData);
                showToast("Patient updated successfully", "success");
            } else {
                await createPatient(formData);
                showToast("Patient created successfully", "success");
            }

            handleCloseModal();
            fetchPatients(); // reload list
        } catch (error) {
            showToast(error?.response?.data?.message || "Something went wrong", "error");
        }
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getPatients();
            setPatient(data);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredPatient = patient.filter((d) => {
        const q = searchQuery.toLowerCase();

        const name = (d.name || "").toLowerCase();
        const phone = (d.phone || "").toLowerCase();
        const email = (d.email || "").toLowerCase();
        const gender = (d.gender || "").toLowerCase();

        return (
            name.includes(q) ||
            phone.includes(q) ||
            email.includes(q) ||
            gender.includes(q)
        );
    });


    const handleFilter = () => {
        alert('Filter options:\n- Filter by Department\n- Filter by Status (Active, On Leave)\n- Filter by Slot Duration\n\nThis would open a filter modal in production.');
    };

    const handleExport = () => {
        const csvContent = [
            ["Name", "Phone", "Email", "DOB", "Gender", "Address"],
            ...patient.map((p) => [
                p.name || "",
                p.phone || "",
                p.email || "",
                p.dob || "",
                p.gender || "",
                p.address || "",
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");


        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const openView = (user) => {
        setViewUser(user);
        setViewOpen(true);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewUser(null);
    };

    const renderRow = (user) => {
        const status = user?.is_active ? "Active" : "Inactive";

        const initials = user?.name
            ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
            : "";

        const color = "#6366f1";

        return (
            <tr
                key={user?.id}
                onDoubleClick={() => openView(user)} 
                style={{ cursor: "pointer" }}
            >
                <td>
                    <div className="user-info-cell">
                        <div className="user-avatar" style={{ backgroundColor: color }}>
                            {user?.Profile_image ? (
                                <img
                                    src={user.Profile_image}
                                    alt={user?.name}
                                    className="avatar-img"
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <span className="user-name-text">{user?.name || "-"}</span>
                    </div>
                </td>

                <td>{user?.phone || "-"}</td>
                <td>{user?.email || "-"}</td>
                <td>{user?.dob || "-"}</td>
                <td>{user?.gender    || "-"}</td>

                <td>
                    <div className="action-buttons">
                        <button
                            className="icon-btn-small"
                            onClick={(e) => {
                                e.stopPropagation(); // prevent double click trigger
                                handleOpenModal(user);
                            }}
                        >
                            <FaEdit />
                        </button>

                        <button
                            className="icon-btn-small delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user.id);
                            }}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };


    return (
        <div className="patient-page">
            <div className="page-header-row">
                <div className="title-section">
                    <h1>Patient Management</h1>
                    <p>Manage healthcare professionals and their schedules <span className="count-badge">{patient.length} TOTAL PATIENT</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New Patient
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
                <CustomTable headers={headers} data={filteredPatient} renderRow={renderRow} onRowDoubleClick={handleRowDoubleClick} />
            </div>

            {/* edit & create */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingPatient ? "Edit Patient" : "Add New Patient"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Phone *</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter patient's full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>DOB</label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingPatient ? "Update Patient" : "Save Patient"}
                        </button>
                    </div>
                </form>
            </CustomModal>

            {/* view */}
            <CustomModal
                isOpen={viewModalOpen}
                onClose={closeViewModal}
                title="Patient Details"
            >
                <div className="patient-view">

                    <div className="view-row">
                        <span className="label">Name</span>
                        <span className="value">{viewPatient?.name || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Phone</span>
                        <span className="value">{viewPatient?.phone || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Email</span>
                        <span className="value">{viewPatient?.email || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">DOB</span>
                        <span className="value">{viewPatient?.dob || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Gender</span>
                        <span className="value">{viewPatient?.gender || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Address</span>
                        <span className="value">{viewPatient?.address || "-"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Created At</span>
                        <span className="value">{viewPatient?.created_at || "-"}</span>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <button className="btn-secondary" onClick={closeViewModal}>
                            Close
                        </button>

                        <button
                            className="btn-primary"
                            onClick={() => {
                                closeViewModal();
                                handleOpenModal(viewPatient); // open edit modal
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </CustomModal>
            {/* confirmation dialog */}
            <ConfirmDialog
                isOpen={deleteDialog}
                title="Delete Patient "
                message="Are you sure you want to delete this Patient?"
                confirmText="Yes, Delete"
                cancelText="No"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog(false)}
            />
        </div>
    );
};

export default Patient;

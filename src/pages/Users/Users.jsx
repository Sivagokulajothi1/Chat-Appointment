import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaUserShield, FaDownload } from 'react-icons/fa';
import CustomTable from '../../components/CustomTable/CustomTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import './Users.css';
import { uploadProfileImage } from '../../services/upload.service';
import { createStaff, deleteStaff, getStaff, updateStaff } from '../../services/staff.service';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Filter from '../../components/Filter/Filter';

const Users = () => {
    const { showToast } = useToast();

    const [users, setUsers] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState(users);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        parent_name: "",
        email: "",
        role: "Receptionist",
        status: "Active",
        password: "",
        Address: "",
        Specification: "",
        work_exprince: "",
        gender: "Male",
        marital_status: "Single",
        Qualification: "",

        profile_pic_file: null,
        profile_pic_preview: "",
        Profile_image: "", //for supbase save

        permissions: { billing: true, records: true, settings: true },
    });

    useEffect(() => {
        fetchusers();
    }, []);


    const headers = ['NAME', 'EMAIL', 'ROLE', 'STATUS', 'ACTIONS'];

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                parent_name: user.Parents_Name,
                status: user.status,
                marital_status: user.Marital_Status,
                Address: user.Address,
                password: '',
                work_exprince: user.Work_Experience,
                Qualification: user.Qualification,
                Specification: user.Specification,
                gender: user.Gender
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'Receptionist',
                status: 'Active',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };


    const handleDelete = (id) => {
        setSelectedId(id);
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteStaff(selectedId);
            showToast("Staff deleted successfully", "success");
            fetchusers();
        } catch (error) {
            showToast(
                error?.response?.data?.message || "Failed to delete staff",
                "error"
            );
        } finally {
            setDeleteDialog(false);
            setSelectedId(null);
        }
    };

    const fetchusers = async (e) => {
        try {
            const respdata = await getStaff();
            console.log("resp.data", respdata.staff);
            setUsers(respdata.staff);
        } catch (error) {
            console.error("Error while creating staff:", error);
            showToast(error?.response?.data?.message || "Failed to fetch staff", "error");
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const colors = ['#eef2ff', '#e0f2fe', '#fef3c7', '#f3f4f6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (editingUser) {
            try {
                const imageUrl = formData?.profile_pic_file
                    ? await uploadProfileImage(formData.profile_pic_file)
                    : editingUser.Profile_image;

                const resp = await updateStaff(editingUser.id, {
                    ...formData,
                    Profile_image: imageUrl
                });

                setUsers(prev =>
                    prev.map(u => u.id === editingUser.id ? resp.staff : u)
                );

                showToast("Staff updated successfully", "success");

            } catch (error) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Update failed";

                showToast(message, "error");
            } finally {
                // console.log("Process completed");
                fetchusers();
            }
        }
        else {
            try {
                console.log("formData :", formData);
                const imageUrl = await uploadProfileImage(formData.profile_pic_file);
                const resp = await createStaff({
                    ...formData,
                    Profile_image: imageUrl
                });

                console.log("resp :", resp);

            } catch (error) {
                console.error("Error while creating staff:", error);

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong";

                showToast(message, "error");
            } finally {
                // console.log("Process completed");
                fetchusers();
            }

            // setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Status'],
            ...users.map(u => [u.name, u.email, u.role, u.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderRow = (user) => {
        const status = user.is_active ? "Active" : "Inactive";
        const initials = user.name
            ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
            : "";

        const color = "#6366f1"; // default color

        return (
            <tr key={user.id}>
                <td>
                    <div className="user-info-cell">
                        <div className="user-avatar" style={{ backgroundColor: color }}>
                            {user.Profile_image ? (
                                <img
                                    src={user.Profile_image}
                                    alt={user.name}
                                    className="avatar-img"
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <span className="user-name-text">{user.name}</span>
                    </div>
                </td>

                <td>{user.email}</td>

                <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role}
                    </span>
                </td>

                <td>
                    <div className="status-indicator">
                        <span className={`status-dot ${status.toLowerCase()}`}></span>
                        <span>{status}</span>
                    </div>
                </td>

                <td>
                    <div className="action-buttons">
                        <button className="icon-btn-small" title="Edit" onClick={() => handleOpenModal(user)}>
                            <FaEdit />
                        </button>
                        <button className="icon-btn-small delete" title="Delete" onClick={() => handleDelete(user.id)}>
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };


    return (
        <div className="users-page">
            <div className="page-header-row">
                <div className="title-section">
                    <h1>User Management</h1>
                    <p>Manage system access and roles for all clinic staff <span className="count-badge">{users.length} TOTAL USERS</span></p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New User
                </button>
            </div>

            <div className="table-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="action-group">
                    <Filter data={users} onFilter={setFilteredUsers} />
                    <button className="export-btn-gray" onClick={handleExport}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            <div className="table-wrapper-card">
                <CustomTable headers={headers} data={filteredUsers} renderRow={renderRow} />
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? "Edit User Requirements" : "Add New User"}
            >
                <form className="modal-form" onSubmit={handleSubmit}>

                    {/* ✅ Profile Picture Upload */}
                    <div className="form-group">
                        <label>Profile Picture</label>

                        <div className="upload-row">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // optional size check (2MB)
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("Image must be under 2MB");
                                        return;
                                    }

                                    // cleanup old blob
                                    if (formData.profile_pic_preview?.startsWith("blob:")) {
                                        URL.revokeObjectURL(formData.profile_pic_preview);
                                    }

                                    const previewUrl = URL.createObjectURL(file);

                                    setFormData({
                                        ...formData,
                                        profile_pic_file: file,
                                        profile_pic_preview: previewUrl,
                                    });
                                }}
                            />

                            {formData.profile_pic_preview && (
                                <div className="img-preview">
                                    <img src={formData.profile_pic_preview} alt="preview" />
                                    <button
                                        type="button"
                                        className="remove-img"
                                        onClick={() => {
                                            if (formData.profile_pic_preview?.startsWith("blob:")) {
                                                URL.revokeObjectURL(formData.profile_pic_preview);
                                            }
                                            setFormData({
                                                ...formData,
                                                profile_pic_file: null,
                                                profile_pic_preview: "",
                                            });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <small className="hint">JPG/PNG/WebP, max 2MB</small>
                    </div>

                    {/* ✅ Full Name */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* ✅ Parent Name (FIXED: use parent_name not name) */}
                    <div className="form-group">
                        <label>Parent Name</label>
                        <input
                            type="text"
                            placeholder="Parent name"
                            value={formData.parent_name}
                            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                            required
                        />
                    </div>

                    {/* ✅ Email */}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* ✅ Address */}
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            placeholder="Address"
                            value={formData.Address}
                            onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                        />
                    </div>

                    {/* ✅ Qualification */}
                    <div className="form-group">
                        <label>Qualification</label>
                        <input
                            type="text"
                            placeholder="e.g., MBBS, BSc Nursing"
                            value={formData.Qualification}
                            onChange={(e) => setFormData({ ...formData, Qualification: e.target.value })}
                        />
                    </div>

                    {/* ✅ Specification */}
                    <div className="form-group">
                        <label>Specification / Specialization</label>
                        <input
                            type="text"
                            placeholder="e.g., Cardiology"
                            value={formData.Specification}
                            onChange={(e) => setFormData({ ...formData, Specification: e.target.value })}
                        />
                    </div>

                    {/* ✅ Work Experience */}
                    <div className="form-group">
                        <label>Work Experience</label>
                        <input
                            type="text"
                            placeholder="e.g., 3 years - Apollo Hospital"
                            value={formData.work_exprince}
                            onChange={(e) => setFormData({ ...formData, work_exprince: e.target.value })}
                        />
                    </div>

                    {/* ✅ Gender (RADIO) */}
                    <div className="form-group">
                        <label>Gender</label>
                        <div className="radio-group">
                            {["Male", "Female", "Other"].map((g) => (
                                <label key={g} className="radio">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={formData.gender === g}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Marital Status (RADIO) */}
                    <div className="form-group">
                        <label>Marital Status</label>
                        <div className="radio-group">
                            {["Single", "Married"].map((m) => (
                                <label key={m} className="radio">
                                    <input
                                        type="radio"
                                        name="marital_status"
                                        value={m}
                                        checked={formData.marital_status === m}
                                        onChange={(e) =>
                                            setFormData({ ...formData, marital_status: e.target.value })
                                        }
                                    />
                                    <span>{m}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Role */}
                    <div className="form-group">
                        <label>System Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option>Admin</option>
                            <option>Doctor</option>
                            <option>Receptionist</option>
                            <option>Nurse</option>
                        </select>
                    </div>

                    {/* ✅ Password */}
                    <div className="form-group">
                        <label>Reset Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <small className="hint">
                            Leave empty to keep current password (when editing)
                        </small>
                    </div>

                    {/* ✅ Status */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.status === "Active"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.checked ? "Active" : "Inactive",
                                    })
                                }
                            />
                            <span>Allow user to log in to the system</span>
                        </label>
                    </div>

                    {/* ✅ Permissions (CONTROLLED not defaultChecked) */}
                    <div className="permissions-section">
                        <p className="permissions-title">
                            <FaUserShield /> Access Permissions
                        </p>

                        <div className="permissions-list">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.permissions?.billing === true}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            permissions: {
                                                ...formData.permissions,
                                                billing: e.target.checked,
                                            },
                                        })
                                    }
                                />
                                Manage Billing & Payments
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.permissions?.records === true}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            permissions: {
                                                ...formData.permissions,
                                                records: e.target.checked,
                                            },
                                        })
                                    }
                                />
                                View Patient Medical Records
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.permissions?.settings === true}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            permissions: {
                                                ...formData.permissions,
                                                settings: e.target.checked,
                                            },
                                        })
                                    }
                                />
                                Edit Clinic Settings
                            </label>
                        </div>
                    </div>

                    {/* ✅ Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-primary">
                            {editingUser ? "Update User" : "Save User"}
                        </button>
                    </div>
                </form>
            </CustomModal>
            <ConfirmDialog
                isOpen={deleteDialog}
                title="Delete User"
                message="Are you sure you want to delete this User?"
                confirmText="Yes, Delete"
                cancelText="No"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog(false)}
            />

        </div>
    );
};

export default Users;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import {
    getAllAdmins,
    getCollegeAdmins,
    createAdmin,
    createCollegeAdmin,
    updateAdmin,
    deleteAdmin,
    resendAdminCredentials,
} from "../services/adminManagementService";

const emptyForm = {
    name: "",
    email: "",
    username: "",
};

export default function AdminManagement() {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const isSubSuperAdmin = user?.role === "sub_super_admin";

    useEffect(() => {
        loadAdmins();
    }, [user]);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const res = isSubSuperAdmin
                ? await getCollegeAdmins(user?.college)
                : await getAllAdmins();
            setAdmins(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                username: formData.username,
            };

            if (editingAdmin) {
                await updateAdmin(editingAdmin._id, payload);
                toast.success("Admin updated successfully");
            } else if (isSubSuperAdmin) {
                await createCollegeAdmin(payload);
                toast.success("Admin created and credentials email sent");
            } else {
                await createAdmin(payload);
                toast.success("Admin created and credentials email sent");
            }

            handleCloseModal();
            loadAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save admin");
        }
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name || "",
            email: admin.email || "",
            username: admin.username || "",
        });
        setShowModal(true);
    };

    const handleResendCredentials = async (admin) => {
        if (!window.confirm(`Resend temporary credentials to ${admin.email}?`)) return;

        try {
            await resendAdminCredentials(admin._id);
            toast.success("Credentials email sent successfully");
            loadAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend credentials");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this admin?")) return;

        try {
            await deleteAdmin(id);
            toast.success("Admin deleted successfully");
            loadAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete admin");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData(emptyForm);
    };

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="admin-management">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">{isSubSuperAdmin ? "College" : "Platform"}</p>
                        <h1>Admin Management</h1>
                        <p className="page-subtitle">
                            {isSubSuperAdmin
                                ? "Create and manage admins for your assigned college."
                                : "Create and manage platform admin accounts."}
                        </p>
                    </div>
                    <button className="btn-primary" type="button" onClick={() => setShowModal(true)}>
                        + Add New Admin
                    </button>
                </div>

                <div className="college-list-panel">
                    <div className="college-list">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length ? admins.map((admin) => (
                                    <tr key={admin._id}>
                                        <td>{admin.name}</td>
                                        <td>{admin.username || "N/A"}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.isActive ? "Active" : "Inactive"}</td>
                                        <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn-edit" type="button" onClick={() => handleEdit(admin)}>
                                                    Edit
                                                </button>
                                                <button className="btn-secondary" type="button" onClick={() => handleResendCredentials(admin)}>
                                                    Resend Credentials
                                                </button>
                                                <button className="btn-delete" type="button" onClick={() => handleDelete(admin._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6">No admins found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <div className="college-form-panel">
                        <div className="panel-topline">
                            <h2>{editingAdmin ? "Edit Admin" : "Add New Admin"}</h2>
                            <button className="btn-secondary" type="button" onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                        <form className="college-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""),
                                        })
                                    }
                                    required
                                    minLength={4}
                                    maxLength={30}
                                    placeholder="admin.name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            {!editingAdmin && (
                                <div className="section-preview">
                                    Temporary credentials will be generated securely and emailed to this admin.
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingAdmin ? "Update" : "Create"}
                                </button>
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
}

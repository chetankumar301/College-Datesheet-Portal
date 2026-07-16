import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from "../services/adminManagementService";
import toast from "react-hot-toast";

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            const res = await getAllAdmins();
            setAdmins(res.data);
        } catch (err) {
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAdmin) {
                await updateAdmin(editingAdmin._id, formData);
                toast.success("Admin updated successfully");
            } else {
                await createAdmin(formData);
                toast.success("Admin created successfully");
            }
            setShowModal(false);
            setEditingAdmin(null);
            setFormData({ name: "", email: "", password: "" });
            loadAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: ""
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
                await deleteAdmin(id);
                toast.success("Admin deleted successfully");
                loadAdmins();
            } catch (err) {
                toast.error("Failed to delete admin");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ name: "", email: "", password: "" });
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
                <div className="header">
                    <h1>Admin Management</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add New Admin
                    </button>
                </div>

                <div className="admin-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin._id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.role}</td>
                                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            className="btn-edit"
                                            onClick={() => handleEdit(admin)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(admin._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{editingAdmin ? "Edit Admin" : "Add New Admin"}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password {editingAdmin ? "(leave blank to keep current)" : ""}:</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required={!editingAdmin}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        {editingAdmin ? "Update" : "Create"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

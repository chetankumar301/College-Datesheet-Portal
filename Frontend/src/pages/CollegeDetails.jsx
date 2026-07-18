import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getCollegeDetails, updateCollege } from "../services/collegeService";
import {
    createCollegeOwner,
    getCollegeOwners,
    updateCollegeOwner,
    toggleCollegeOwnerStatus,
    resetCollegeOwnerPassword,
    deleteAdmin,
} from "../services/adminManagementService";

const PLAN_PRICES = {
    basic: 5,
    standard: 10,
};

const emptyOwner = {
    name: "",
    username: "",
    email: "",
    password: "",
    collegeId: "",
};

export default function CollegeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [collegeData, setCollegeData] = useState(null);
    const [owners, setOwners] = useState([]);
    const [showOwnerForm, setShowOwnerForm] = useState(false);
    const [showSettingsForm, setShowSettingsForm] = useState(false);
    const [editingOwner, setEditingOwner] = useState(null);
    const [ownerForm, setOwnerForm] = useState(emptyOwner);
    const [settingsForm, setSettingsForm] = useState({
        subscriptionStatus: "trial",
        pricingPlan: "basic",
        currentStudents: 1000,
        subscriptionEnd: "",
        isSuspended: false,
    });

    const selectedPlan = (settingsForm.pricingPlan || "basic").toLowerCase();
    const perStudentPrice = PLAN_PRICES[selectedPlan] || PLAN_PRICES.basic;
    const studentCount = Number(settingsForm.currentStudents) || 0;
    const calculatedAmount = studentCount * perStudentPrice;

    useEffect(() => {
        if (id) load();
    }, [id]);

    const load = async () => {
        try {
            setLoading(true);
            const [detailRes, ownersRes] = await Promise.all([
                getCollegeDetails(id),
                getCollegeOwners(id),
            ]);
            const detail = detailRes.data || null;
            setCollegeData(detail);
            setOwners(ownersRes.data || []);

            const college = detail?.college || detail;
            setSettingsForm({
                subscriptionStatus: college?.subscriptionStatus || "trial",
                pricingPlan: college?.pricingPlan || "basic",
                currentStudents: college?.currentStudents || 1000,
                subscriptionEnd: college?.subscriptionEnd ? String(college.subscriptionEnd).slice(0, 10) : "",
                isSuspended: Boolean(college?.isSuspended),
            });
        } catch (err) {
            toast.error("Failed to load college details");
        } finally {
            setLoading(false);
        }
    };

    const closeOwnerForm = () => {
        setShowOwnerForm(false);
        setEditingOwner(null);
        setOwnerForm(emptyOwner);
    };

    const handleSaveOwner = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...ownerForm,
                collegeId: id,
                role: "sub_super_admin",
            };

            if (editingOwner) {
                await updateCollegeOwner(editingOwner._id, payload);
                toast.success("College Sub Super Admin updated successfully");
            } else {
                await createCollegeOwner(payload);
                toast.success("College Sub Super Admin created successfully");
            }

            closeOwnerForm();
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save owner");
        }
    };

    const handleEditOwner = (owner) => {
        setEditingOwner(owner);
        setOwnerForm({
            name: owner.name || "",
            username: owner.username || "",
            email: owner.email || "",
            password: "",
            collegeId: id,
        });
        setShowOwnerForm(true);
    };

    const handleToggleOwner = async (owner) => {
        try {
            await toggleCollegeOwnerStatus(owner._id, !owner.isActive);
            toast.success("Owner status updated");
            load();
        } catch (err) {
            toast.error("Failed to update owner status");
        }
    };

    const handleResetPassword = async (owner) => {
        const password = window.prompt("Enter a new password for this owner:");
        if (!password) return;
        try {
            await resetCollegeOwnerPassword(owner._id, password);
            toast.success("College Sub Super Admin password reset successfully");
        } catch (err) {
            toast.error("Failed to reset College Sub Super Admin password");
        }
    };

    const handleDeleteOwner = async (ownerId) => {
        if (!window.confirm("Delete this College Sub Super Admin?")) return;
        try {
            await deleteAdmin(ownerId);
            toast.success("College Sub Super Admin deleted successfully");
            load();
        } catch (err) {
            toast.error("Failed to delete College Sub Super Admin");
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await updateCollege(id, {
                subscriptionStatus: settingsForm.subscriptionStatus,
                pricingPlan: settingsForm.pricingPlan,
                currentStudents: Number(settingsForm.currentStudents) || 0,
                subscriptionEnd: settingsForm.subscriptionEnd || undefined,
                isSuspended: settingsForm.isSuspended,
            });
            toast.success("College settings updated");
            setShowSettingsForm(false);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update settings");
        }
    };

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    const college = collegeData?.college || collegeData;

    return (
        <Layout>
            <div className="college-management-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">College Details</p>
                        <h1>{college?.name || "College"}</h1>
                        <p className="page-subtitle">
                            {college?.code} · {college?.email}
                        </p>
                    </div>
                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => navigate("/super-admin/colleges")}
                    >
                        Back to Colleges
                    </button>
                </div>

                <div className="exam-cards">
                    <div className="exam-card">
                        <strong>Subscription Plan</strong>
                        <span>{college?.pricingPlan || "N/A"}</span>
                    </div>
                    <div className="exam-card">
                        <strong>License Expiry</strong>
                        <span>
                            {college?.subscriptionEnd
                                ? new Date(college.subscriptionEnd).toLocaleDateString()
                                : "N/A"}
                        </span>
                    </div>
                    <div className="exam-card">
                        <strong>Students</strong>
                        <span>{collegeData?.stats?.studentCount || college?.currentStudents || 0}</span>
                    </div>
                    <div className="exam-card">
                        <strong>Owners</strong>
                        <span>{collegeData?.stats?.ownerCount || owners.length}</span>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>College Information</h2>
                        <div className="analytics-list">
                            <div className="analytics-row"><span>Code</span><span>{college?.code}</span></div>
                            <div className="analytics-row"><span>Email</span><span>{college?.email}</span></div>
                            <div className="analytics-row"><span>Phone</span><span>{college?.phone}</span></div>
                            <div className="analytics-row"><span>Address</span><span>{college?.address}</span></div>
                            <div className="analytics-row"><span>City</span><span>{college?.city}</span></div>
                            <div className="analytics-row"><span>State</span><span>{college?.state}</span></div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Usage Statistics</h2>
                        <div className="analytics-list">
                            <div className="analytics-row"><span>Admins</span><span>{collegeData?.stats?.adminCount || 0}</span></div>
                            <div className="analytics-row"><span>Students</span><span>{collegeData?.stats?.studentCount || 0}</span></div>
                            <div className="analytics-row"><span>Owner Accounts</span><span>{collegeData?.stats?.ownerCount || 0}</span></div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Activity Logs</h2>
                        <div className="status-grid">
                            {(collegeData?.activityLogs || []).map((log) => (
                                <div key={log._id} className="status-item">
                                    <span className="status-dot"></span>
                                    <span>
                                        {log.action || log.activityType} -{" "}
                                        {new Date(log.createdAt || log.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Settings</h2>
                        <div className="section-preview">
                            <h2>College lifecycle</h2>
                            <ul>
                                <li>Status: {college?.subscriptionStatus}</li>
                                <li>Suspended: {college?.isSuspended ? "Yes" : "No"}</li>
                                <li>Student Count: {college?.currentStudents || 0}</li>
                            </ul>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => setShowSettingsForm((current) => !current)}
                            >
                                {showSettingsForm ? "Hide Settings Editor" : "Edit Settings"}
                            </button>
                        </div>
                    </div>
                </div>

                {showSettingsForm && (
                    <div className="college-form-panel">
                        <div className="panel-topline">
                            <h2>Edit College Settings</h2>
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => setShowSettingsForm(false)}
                            >
                                Close
                            </button>
                        </div>
                        <form className="college-form" onSubmit={handleSaveSettings}>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Subscription Status</label>
                                    <select
                                        value={settingsForm.subscriptionStatus}
                                        onChange={(e) =>
                                            setSettingsForm({ ...settingsForm, subscriptionStatus: e.target.value })
                                        }
                                    >
                                        <option value="trial">Trial</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Pricing Plan</label>
                                    <select
                                        value={settingsForm.pricingPlan}
                                        onChange={(e) =>
                                            setSettingsForm({ ...settingsForm, pricingPlan: e.target.value })
                                        }
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="standard">Standard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Student Count</label>
                                    <input
                                        type="number"
                                        value={settingsForm.currentStudents}
                                        onChange={(e) =>
                                            setSettingsForm({ ...settingsForm, currentStudents: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>License Expiry</label>
                                    <input
                                        type="date"
                                        value={settingsForm.subscriptionEnd}
                                        onChange={(e) =>
                                            setSettingsForm({ ...settingsForm, subscriptionEnd: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={settingsForm.isSuspended}
                                        onChange={(e) =>
                                            setSettingsForm({ ...settingsForm, isSuspended: e.target.checked })
                                        }
                                    />{" "}
                                    Suspended
                                </label>
                            </div>
                            <div className="section-preview" style={{ marginBottom: "16px" }}>
                                <h2>Subscription Formula</h2>
                                <ul>
                                    <li>Plan: {selectedPlan}</li>
                                    <li>Price per student: ₹{perStudentPrice}</li>
                                    <li>Current student count: {studentCount}</li>
                                    <li>Total amount: ₹{calculatedAmount.toLocaleString()}/year</li>
                                </ul>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    Save Settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="college-list-panel">
                    <div className="panel-topline">
                        <h2>College Sub Super Admins</h2>
                        <button
                            className="btn-primary"
                            type="button"
                            onClick={() => {
                                setEditingOwner(null);
                                setOwnerForm({ ...emptyOwner, collegeId: id });
                                setShowOwnerForm(true);
                            }}
                        >
                            + Create College Sub Super Admin
                        </button>
                    </div>

                    <div className="college-list">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.map((owner) => (
                                    <tr key={owner._id}>
                                        <td>{owner.name}</td>
                                        <td>{owner.username || "N/A"}</td>
                                        <td>{owner.email}</td>
                                        <td>{owner.isActive ? "Active" : "Inactive"}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="btn-edit"
                                                    type="button"
                                                    onClick={() => handleEditOwner(owner)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-upgrade"
                                                    type="button"
                                                    onClick={() => handleToggleOwner(owner)}
                                                >
                                                    {owner.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    className="btn-secondary"
                                                    type="button"
                                                    onClick={() => handleResetPassword(owner)}
                                                >
                                                    Reset Password
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    type="button"
                                                    onClick={() => handleDeleteOwner(owner._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showOwnerForm && (
                    <div className="college-form-panel">
                        <div className="panel-topline">
                            <h2>{editingOwner ? "Edit College Sub Super Admin" : "Create College Sub Super Admin"}</h2>
                            <button className="btn-secondary" type="button" onClick={closeOwnerForm}>
                                Close
                            </button>
                        </div>
                        <form className="college-form" onSubmit={handleSaveOwner}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value={ownerForm.name}
                                    onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    value={ownerForm.username}
                                    onChange={(e) =>
                                        setOwnerForm({
                                            ...ownerForm,
                                            username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""),
                                        })
                                    }
                                    required
                                    minLength={4}
                                    maxLength={30}
                                    placeholder="chetan.kumar"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={ownerForm.email}
                                    onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Temporary Password {editingOwner ? "(leave blank to keep current)" : ""}</label>
                                <input
                                    type="password"
                                    value={ownerForm.password}
                                    onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                                    required={!editingOwner}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingOwner ? "Update" : "Create"}
                                </button>
                                <button type="button" className="btn-secondary" onClick={closeOwnerForm}>
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

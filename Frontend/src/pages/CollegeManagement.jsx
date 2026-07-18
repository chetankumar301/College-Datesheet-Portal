import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { activateCollege, createCollege, deleteCollege, getAllColleges, suspendCollege, updateCollege } from "../services/collegeService";

const emptyForm = {
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pricingPlan: "basic",
    currentStudents: 1000,
};

const PLAN_OPTIONS = ["basic", "standard"];

export default function CollegeManagement() {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadColleges();
    }, []);

    const loadColleges = async () => {
        try {
            const res = await getAllColleges();
            setColleges(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load colleges");
        } finally {
            setLoading(false);
        }
    };

    const summary = useMemo(() => ({
        total: colleges.length,
        active: colleges.filter((c) => !c.isSuspended).length,
        suspended: colleges.filter((c) => c.isSuspended).length,
        standard: colleges.filter((c) => (c.pricingPlan || "").toLowerCase() === "standard").length,
    }), [colleges]);

    const filteredColleges = useMemo(() => {
        if (statusFilter === "all") return colleges;
        if (statusFilter === "active") return colleges.filter((c) => !c.isSuspended);
        if (statusFilter === "suspended") return colleges.filter((c) => c.isSuspended);
        return colleges.filter((c) => (c.pricingPlan || "").toLowerCase() === statusFilter);
    }, [colleges, statusFilter]);

    const resetForm = () => {
        setEditingCollege(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                currentStudents: Number(formData.currentStudents) || 0,
                pricingPlan: PLAN_OPTIONS.includes(formData.pricingPlan) ? formData.pricingPlan : "basic",
            };
            const response = editingCollege
                ? await updateCollege(editingCollege._id, payload)
                : await createCollege(payload);

            const createdCollege = response?.data?.college || response?.data;
            toast.success(editingCollege ? "College updated successfully" : "College created successfully");
            setShowForm(false);
            resetForm();
            await loadColleges();
            if (!editingCollege && createdCollege?._id) {
                navigate(`/super-admin/colleges/${createdCollege._id}`, { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (college) => {
        setEditingCollege(college);
        setFormData({
            name: college.name || "",
            code: college.code || "",
            email: college.email || "",
            phone: college.phone || "",
            address: college.address || "",
            city: college.city || "",
            state: college.state || "",
            country: college.country || "India",
            pricingPlan: PLAN_OPTIONS.includes((college.pricingPlan || "").toLowerCase()) ? college.pricingPlan : "basic",
            currentStudents: college.currentStudents || 0,
        });
        setShowForm(true);
    };

    const handleSuspend = async (id) => {
        const reason = window.prompt("Enter suspension reason:");
        if (!reason) return;
        await suspendCollege(id, reason);
        toast.success("College suspended successfully");
        loadColleges();
    };

    const handleActivate = async (id) => {
        await activateCollege(id);
        toast.success("College activated successfully");
        loadColleges();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this college?")) return;
        await deleteCollege(id);
        toast.success("College deleted successfully");
        loadColleges();
    };

    if (loading) {
        return <Layout><h2>Loading...</h2></Layout>;
    }

    return (
        <Layout>
            <div className="college-management-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Super Admin</p>
                        <h1>College Management</h1>
                        <p className="page-subtitle">Manage colleges and subscription settings.</p>
                    </div>
                    <button className="btn-primary" type="button" onClick={() => { resetForm(); setShowForm(true); }}>
                        + Add New College
                    </button>
                </div>

                <div className="exam-cards">
                    <div className="exam-card"><strong>Total Colleges</strong><span>{summary.total}</span></div>
                    <div className="exam-card"><strong>Active</strong><span>{summary.active}</span></div>
                    <div className="exam-card"><strong>Suspended</strong><span>{summary.suspended}</span></div>
                    <div className="exam-card"><strong>Standard</strong><span>{summary.standard}</span></div>
                </div>

                <div className="college-management-grid">
                    <section className="college-list-panel">
                        <div className="panel-topline">
                            <h2>Colleges</h2>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="basic">Basic</option>
                                <option value="standard">Standard</option>
                            </select>
                        </div>
                        <div className="college-cards">
                            {filteredColleges.map((college) => (
                                <article key={college._id} className="college-card-row">
                                    <div className="college-card-main">
                                        <div>
                                            <h3 className="college-card-title">{college.name}</h3>
                                            <p className="college-card-code">{college.code}</p>
                                        </div>
                                        <div className="college-card-metrics">
                                            <span className="metric-pill">
                                                Plan: {college.pricingPlan || "basic"}
                                            </span>
                                            <span className="metric-pill">
                                                Students: {college.currentStudents || 0}
                                            </span>
                                            <span
                                                className={`status-pill ${college.isSuspended ? "is-suspended" : "is-active"}`}
                                            >
                                                {college.isSuspended ? "Suspended" : college.subscriptionStatus || "active"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="college-card-actions">
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => navigate(`/super-admin/colleges/${college._id}`)}
                                        >
                                            Manage
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => handleEdit(college)}
                                        >
                                            Edit
                                        </button>
                                        {college.isSuspended ? (
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => handleActivate(college._id)}
                                            >
                                                Activate
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => handleSuspend(college._id)}
                                            >
                                                Suspend
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn-danger"
                                            onClick={() => handleDelete(college._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {showForm && (
                        <section className="college-form-panel">
                            <div className="panel-topline">
                                <h2>{editingCollege ? "Edit College" : "Add New College"}</h2>
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Close</button>
                            </div>
                            <form className="college-form" onSubmit={handleSubmit}>
                                <div className="form-group"><label>College Name</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                                <div className="form-group"><label>College Code</label><input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required /></div>
                                <div className="form-grid-2">
                                    <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                                    <div className="form-group"><label>Phone</label><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
                                </div>
                                <div className="form-group"><label>Address</label><input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required /></div>
                                <div className="form-grid-2">
                                    <div className="form-group"><label>City</label><input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required /></div>
                                    <div className="form-group"><label>State</label><input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required /></div>
                                </div>
                                <div className="form-group"><label>Country</label><input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} /></div>
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>Subscription Plan</label>
                                        <select value={formData.pricingPlan} onChange={(e) => setFormData({ ...formData, pricingPlan: e.target.value })}>
                                            <option value="basic">Basic</option>
                                            <option value="standard">Standard</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Student Count</label>
                                        <input type="number" value={formData.currentStudents} onChange={(e) => setFormData({ ...formData, currentStudents: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Creating..." : editingCollege ? "Update" : "Create"}</button>
                                    <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </Layout>
    );
}

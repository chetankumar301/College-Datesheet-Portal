import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getAdminComplaints, updateComplaintReply } from "../services/complaintService";

export default function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: "", priority: "", category: "" });
    const [drafts, setDrafts] = useState({});

    useEffect(() => {
        loadComplaints();
    }, [filters]);

    const loadComplaints = async () => {
        try {
            setLoading(true);
            const res = await getAdminComplaints(filters);
            setComplaints(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        pending: complaints.filter((item) => item.status === "PENDING").length,
        review: complaints.filter((item) => item.status === "IN_REVIEW").length,
        resolved: complaints.filter((item) => item.status === "RESOLVED").length,
    }), [complaints]);

    const updateDraft = (id, key, value) => {
        setDrafts({ ...drafts, [id]: { ...(drafts[id] || {}), [key]: value } });
    };

    const handleUpdate = async (complaint) => {
        const draft = drafts[complaint._id] || {};
        try {
            await updateComplaintReply(complaint._id, {
                reply: draft.reply || complaint.adminReply || "Complaint reviewed.",
                status: draft.status || complaint.status,
                priority: draft.priority || complaint.priority,
                category: draft.category || complaint.category,
            });
            toast.success("Complaint updated");
            loadComplaints();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update complaint");
        }
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">Student support</p>
                        <h1>Complaints</h1>
                        <p className="page-subtitle">Review, prioritize, assign, respond to, and track student complaints.</p>
                    </div>
                </div>

                <div className="exam-cards">
                    <div className="exam-card"><strong>Pending</strong><span>{stats.pending}</span></div>
                    <div className="exam-card"><strong>In Review</strong><span>{stats.review}</span></div>
                    <div className="exam-card"><strong>Resolved</strong><span>{stats.resolved}</span></div>
                    <div className="exam-card"><strong>Total</strong><span>{complaints.length}</span></div>
                </div>

                <div className="utility-panel">
                    <div className="filters form-grid-2">
                        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                        <input placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
                    </div>

                    <div className="stack-list">
                        {loading ? <p>Loading complaints...</p> : complaints.length ? complaints.map((complaint) => {
                            const draft = drafts[complaint._id] || {};
                            return (
                                <div className="utility-card" key={complaint._id}>
                                    <div className="panel-topline">
                                        <div>
                                            <h2>{complaint.complaintType || "Complaint"} - {complaint.status}</h2>
                                            <p>{complaint.description}</p>
                                        </div>
                                        <span className="status-badge">{complaint.priority || "MEDIUM"}</span>
                                    </div>
                                    <div className="analytics-list">
                                        <div className="analytics-row"><span>Student</span><span>{complaint.student?.name || "N/A"} ({complaint.student?.email || "N/A"})</span></div>
                                        <div className="analytics-row"><span>Subjects</span><span>{complaint.subject1?.subjectName || "N/A"} / {complaint.subject2?.subjectName || "N/A"}</span></div>
                                        <div className="analytics-row"><span>Category</span><span>{complaint.category || "Exam"}</span></div>
                                        <div className="analytics-row"><span>Assigned To</span><span>{complaint.assignedTo?.name || "Current admin"}</span></div>
                                    </div>
                                    <div className="form-grid-2">
                                        <select value={draft.status || complaint.status} onChange={(e) => updateDraft(complaint._id, "status", e.target.value)}>
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_REVIEW">In Review</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                        <select value={draft.priority || complaint.priority || "MEDIUM"} onChange={(e) => updateDraft(complaint._id, "priority", e.target.value)}>
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <textarea
                                        rows="3"
                                        placeholder="Write response"
                                        value={draft.reply ?? complaint.adminReply ?? ""}
                                        onChange={(e) => updateDraft(complaint._id, "reply", e.target.value)}
                                    />
                                    <div className="table-actions">
                                        <button className="btn-primary" type="button" onClick={() => handleUpdate(complaint)}>Save Response</button>
                                    </div>
                                    {complaint.history?.length ? (
                                        <div className="section-preview">
                                            {complaint.history.map((item, index) => (
                                                <p key={`${complaint._id}-${index}`}>{item.status} - {item.note} - {item.at ? new Date(item.at).toLocaleString() : ""}</p>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }) : <div className="upload-empty"><h3>No complaints found</h3><p>Nothing matches the current filters.</p></div>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

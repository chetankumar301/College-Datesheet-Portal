import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getPendingDatesheets, getApprovedDatesheets, getRejectedDatesheets, approveDatesheet, rejectDatesheet, publishDatesheet } from "../services/datesheetApprovalService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DatesheetApproval() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("pending");
    const [pending, setPending] = useState([]);
    const [approved, setApproved] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectingId, setRejectingId] = useState(null);

    useEffect(() => {
        if (user?.college) {
            loadData();
        }
    }, [user, activeTab]);

    const loadData = async () => {
        try {
            const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
                getPendingDatesheets(user.college),
                getApprovedDatesheets(user.college),
                getRejectedDatesheets(user.college)
            ]);
            setPending(pendingRes.data);
            setApproved(approvedRes.data);
            setRejected(rejectedRes.data);
        } catch (err) {
            toast.error("Failed to load datesheets");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveDatesheet(id);
            toast.success("Datesheet approved");
            loadData();
        } catch (err) {
            toast.error("Failed to approve datesheet");
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason.trim()) {
            toast.error("Please enter a rejection reason");
            return;
        }
        try {
            await rejectDatesheet(id, rejectReason);
            toast.success("Datesheet rejected");
            setRejectReason("");
            setRejectingId(null);
            loadData();
        } catch (err) {
            toast.error("Failed to reject datesheet");
        }
    };

    const handlePublish = async (id) => {
        try {
            await publishDatesheet(id);
            toast.success("Datesheet published");
            loadData();
        } catch (err) {
            toast.error("Failed to publish datesheet");
        }
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
            <div className="datesheet-approval">
                <h1>Datesheet Approval</h1>
                
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === "pending" ? "active" : ""}`}
                        onClick={() => setActiveTab("pending")}
                    >
                        Pending ({pending.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === "approved" ? "active" : ""}`}
                        onClick={() => setActiveTab("approved")}
                    >
                        Approved ({approved.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === "rejected" ? "active" : ""}`}
                        onClick={() => setActiveTab("rejected")}
                    >
                        Rejected ({rejected.length})
                    </button>
                </div>

                {activeTab === "pending" && (
                    <div className="datesheet-list">
                        {pending.length === 0 ? (
                            <p>No pending datesheets</p>
                        ) : (
                            pending.map((datesheet) => (
                                <div key={datesheet._id} className="datesheet-card">
                                    <h3>{datesheet.title}</h3>
                                    <div className="datesheet-info">
                                        <span>Course: {datesheet.course?.name}</span>
                                        <span>Semester: {datesheet.semester}</span>
                                        <span>Type: {datesheet.examType}</span>
                                        <span>Submitted: {new Date(datesheet.submittedForApprovalAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="datesheet-actions">
                                        <button className="btn-approve" onClick={() => handleApprove(datesheet._id)}>Approve</button>
                                        <button className="btn-reject" onClick={() => setRejectingId(datesheet._id)}>Reject</button>
                                    </div>
                                    {rejectingId === datesheet._id && (
                                        <div className="reject-form">
                                            <textarea
                                                placeholder="Enter rejection reason..."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                            <div className="reject-actions">
                                                <button className="btn-confirm" onClick={() => handleReject(datesheet._id)}>Confirm Reject</button>
                                                <button className="btn-cancel" onClick={() => { setRejectingId(null); setRejectReason(""); }}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "approved" && (
                    <div className="datesheet-list">
                        {approved.length === 0 ? (
                            <p>No approved datesheets</p>
                        ) : (
                            approved.map((datesheet) => (
                                <div key={datesheet._id} className="datesheet-card">
                                    <h3>{datesheet.title}</h3>
                                    <div className="datesheet-info">
                                        <span>Course: {datesheet.course?.name}</span>
                                        <span>Semester: {datesheet.semester}</span>
                                        <span>Type: {datesheet.examType}</span>
                                        <span>Approved: {new Date(datesheet.approvedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="datesheet-actions">
                                        <button className="btn-publish" onClick={() => handlePublish(datesheet._id)}>Publish</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "rejected" && (
                    <div className="datesheet-list">
                        {rejected.length === 0 ? (
                            <p>No rejected datesheets</p>
                        ) : (
                            rejected.map((datesheet) => (
                                <div key={datesheet._id} className="datesheet-card rejected">
                                    <h3>{datesheet.title}</h3>
                                    <div className="datesheet-info">
                                        <span>Course: {datesheet.course?.name}</span>
                                        <span>Semester: {datesheet.semester}</span>
                                        <span>Type: {datesheet.examType}</span>
                                        <span>Rejected: {new Date(datesheet.rejectedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="rejection-reason">
                                        <strong>Reason:</strong> {datesheet.rejectionReason}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

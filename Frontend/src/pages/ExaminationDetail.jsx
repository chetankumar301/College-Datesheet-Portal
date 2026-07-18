import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
    approveExamination,
    getExaminationHistory,
    getScheduleVersions,
    getScheduleSlots,
    publishExamination,
    moveScheduleSlot,
    requestExaminationChanges,
    submitExaminationForReview,
    validateGeneratedSchedule,
} from "../services/examService";
import toast from "react-hot-toast";

export default function ExaminationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [versions, setVersions] = useState([]);
    const [slots, setSlots] = useState([]);
    const [review, setReview] = useState(null);
    const [busy, setBusy] = useState(false);
    const [slotEdit, setSlotEdit] = useState({ slotId: "", date: "", shift: "" });
    const latestVersion = versions[0] || null;
    const selectedSlot = slots.find((slot) => slot._id === slotEdit.slotId) || null;

    useEffect(() => {
        if (id) load();
    }, [id]);

    const load = async () => {
        try {
            const [historyRes, reviewRes, versionsRes] = await Promise.all([
                getExaminationHistory(id),
                validateGeneratedSchedule(id),
                getScheduleVersions(id),
            ]);
            setHistory(historyRes.data || []);
            setReview(reviewRes.data || null);
            setVersions(versionsRes.data || []);
            const slotsRes = await getScheduleSlots(id);
            setSlots(slotsRes.data || []);
        } catch (err) {
            toast.error("Failed to load examination details");
        }
    };

    const runAction = async (action) => {
        setBusy(true);
        try {
            await action();
            toast.success("Action completed");
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setBusy(false);
        }
    };

    const handleMoveSlot = async () => {
        if (!slotEdit.slotId || !slotEdit.date || !slotEdit.shift) {
            toast.error("Please choose a slot, date, and shift");
            return;
        }

        setBusy(true);
        try {
            await moveScheduleSlot(id, slotEdit.slotId, {
                date: slotEdit.date,
                shift: slotEdit.shift,
            });
            toast.success("Slot moved successfully");
            setSlotEdit({ slotId: "", date: "", shift: "" });
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to move slot");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Layout>
            <div className="exams-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Examination</p>
                        <h1>Examination Details</h1>
                        <p className="page-subtitle">
                            Review status, validation, and approval history.
                        </p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/exams")}>
                        Back
                    </button>
                </div>

                <div className="college-list-panel">
                    <div className="detail-hero">
                        <div>
                            <p className="page-kicker">Live Schedule Review</p>
                            <h2>Review, validate, and fine-tune the generated datesheet</h2>
                            <p className="page-subtitle">
                                Use the manual editor only when a slot needs to be shifted after validation.
                            </p>
                        </div>
                        <div className="detail-hero-meta">
                            <div className="detail-meta-chip">
                                <span>Latest version</span>
                                <strong>{latestVersion ? `V${latestVersion.versionNumber}` : "None"}</strong>
                            </div>
                            <div className="detail-meta-chip">
                                <span>Slots</span>
                                <strong>{slots.length}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="exam-cards">
                        <div className="exam-card">
                            <strong>Status</strong>
                            <span>{review?.valid ? "Valid" : "Needs review"}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Available Days</strong>
                            <span>{review?.availability?.actualAvailableDays || 0}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Warnings</strong>
                            <span>{review?.warnings?.length || 0}</span>
                        </div>
                    </div>

                    <div className="detail-notes-grid">
                        <div className="detail-note-box">
                            <strong>Hard violations</strong>
                            <p>
                                {review?.hardViolations?.length
                                    ? review.hardViolations.join(", ")
                                    : "No hard violations detected"}
                            </p>
                        </div>
                        <div className="detail-note-box">
                            <strong>Resource summary</strong>
                            <p>
                                Rooms: {review?.resourceSummary?.rooms || 0}, Capacity:{" "}
                                {review?.resourceSummary?.totalCapacity || 0}, Faculty clashes:{" "}
                                {review?.resourceSummary?.facultyClashes || 0}
                            </p>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: "16px" }}>
                        <button className="btn-primary" disabled={busy} onClick={() => runAction(() => submitExaminationForReview(id))}>
                            Submit for Review
                        </button>
                        <button className="btn-secondary" disabled={busy} onClick={() => runAction(() => requestExaminationChanges(id, { comment: "Need schedule refinement" }))}>
                            Request Changes
                        </button>
                        <button className="btn-secondary" disabled={busy} onClick={() => runAction(() => approveExamination(id))}>
                            Approve
                        </button>
                        <button className="btn-secondary" disabled={busy} onClick={() => runAction(() => publishExamination(id))}>
                            Publish
                        </button>
                    </div>
                </div>

                <div className="college-list-panel">
                    <div className="panel-topline">
                        <h2>Approval History</h2>
                        <span>{history.length} entries</span>
                    </div>
                    <div className="status-grid">
                        {history.map((item) => (
                            <div key={item._id} className="status-item">
                                <span className="status-dot"></span>
                                <span>{item.action} - {item.toStatus || "n/a"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="college-list-panel">
                    <div className="panel-topline">
                        <h2>Schedule Versions</h2>
                        <span>{versions.length} snapshots</span>
                    </div>
                    <div className="status-grid">
                        {versions.map((version) => (
                            <div key={version._id} className="status-item">
                                <span className="status-dot"></span>
                                <span>Version {version.versionNumber} - {version.changeSummary || "Snapshot"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="college-list-panel">
                    <div className="panel-topline">
                        <h2>Manual Editing</h2>
                        <span>{slots.length} slots</span>
                    </div>
                    <div className="detail-note-box" style={{ marginBottom: "16px" }}>
                        <strong>Selected slot</strong>
                        <p>
                            {selectedSlot
                                ? `${selectedSlot.subjectId?.subjectName || selectedSlot.subjectId?.subjectCode || "Subject"} on ${new Date(selectedSlot.date).toLocaleDateString()} during ${selectedSlot.shift}`
                                : "Choose a slot to edit its date or shift."}
                        </p>
                    </div>
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Slot</label>
                            <select
                                value={slotEdit.slotId}
                                onChange={(e) => setSlotEdit({ ...slotEdit, slotId: e.target.value })}
                            >
                                <option value="">Select slot</option>
                                {slots.map((slot) => (
                                    <option key={slot._id} value={slot._id}>
                                        {slot.subjectId?.subjectName || slot.subjectId?.subjectCode || "Subject"} - {new Date(slot.date).toLocaleDateString()} - {slot.shift}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>New Date</label>
                            <input
                                type="date"
                                value={slotEdit.date}
                                onChange={(e) => setSlotEdit({ ...slotEdit, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: "14px" }}>
                        <label>New Shift</label>
                        <select
                            value={slotEdit.shift}
                            onChange={(e) => setSlotEdit({ ...slotEdit, shift: e.target.value })}
                        >
                            <option value="">Select shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                        </select>
                    </div>
                    <div className="form-actions" style={{ marginTop: "16px" }}>
                        <button className="btn-primary" disabled={busy} onClick={handleMoveSlot}>
                            Move Slot
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

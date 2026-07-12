import React from "react";

function ComplaintTimeline({ complaint }) {
    return (
        <div className="complaint-timeline">
            <h3>Complaint Timeline</h3>
            <div className="timeline-item">
                <span className="date">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                <span className="status">{complaint.status}</span>
            </div>
        </div>
    );
}

export default ComplaintTimeline;
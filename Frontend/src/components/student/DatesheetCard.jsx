import React from "react";

function DatesheetCard({ datesheet, onClick }) {
    return (
        <div className="datesheet-card" onClick={onClick}>
            <h3>{datesheet.title || "Exam Schedule"}</h3>
            <p>{datesheet.academicSession || "Current Session"}</p>
            <span className="status">{datesheet.status || "Published"}</span>
        </div>
    );
}

export default DatesheetCard;
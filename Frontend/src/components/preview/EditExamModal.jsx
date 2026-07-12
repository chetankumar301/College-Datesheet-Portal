import React from "react";

function EditExamModal({ exam, onSave, onClose }) {
    return (
        <div className="edit-exam-modal">
            <h3>Edit Exam</h3>
            <p>Edit exam details here</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default EditExamModal;
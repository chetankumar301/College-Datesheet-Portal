import React from "react";

function PreviewRow({ exam, onEdit }) {
    return (
        <tr className="preview-row">
            <td>{exam.subject}</td>
            <td>{exam.date}</td>
            <td>{exam.time}</td>
            <td>{exam.status}</td>
            <td>
                <button onClick={onEdit}>Edit</button>
            </td>
        </tr>
    );
}

export default PreviewRow;
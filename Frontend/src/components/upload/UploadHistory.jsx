export default function UploadHistory({ uploads, loading = false }) {
    return (
        <section className="history">
            <div className="panel-topline">
                <h2>Upload History</h2>
                <span>{uploads.length} files</span>
            </div>

            {loading ? (
                <div className="upload-empty">Loading uploads...</div>
            ) : uploads.length ? (
                <div className="upload-history-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>PDF</th>
                                <th>Exam Type</th>
                                <th>Status</th>
                                <th>Uploaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploads.map((upload) => (
                                <tr key={upload._id}>
                                    <td>{upload.originalName}</td>
                                    <td>{upload.examType || "N/A"}</td>
                                    <td>
                                        <span className={`upload-status status-${String(upload.status || "").toLowerCase()}`}>
                                            {upload.status}
                                        </span>
                                    </td>
                                    <td>{upload.createdAt ? new Date(upload.createdAt).toLocaleString() : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="upload-empty">
                    <h3>No uploads yet</h3>
                    <p>Your uploaded datesheet PDFs will appear here.</p>
                </div>
            )}
        </section>
    );
}

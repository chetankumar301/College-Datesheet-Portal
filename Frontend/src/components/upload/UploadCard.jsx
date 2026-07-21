export default function UploadCard({ file, onUpload, onRemove, uploading = false }) {
    return (
        <div className="upload-card">
            <div>
                <h3>{file.name}</h3>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>

            <div className="upload-card-actions">
                <button type="button" className="btn-primary" onClick={onUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
                <button type="button" className="btn-secondary" onClick={onRemove} disabled={uploading}>
                    Remove
                </button>
            </div>
        </div>
    );
}

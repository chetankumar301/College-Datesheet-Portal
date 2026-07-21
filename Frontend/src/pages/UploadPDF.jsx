import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import UploadCard from "../components/upload/UploadCard";
import UploadHistory from "../components/upload/UploadHistory";
import ProgressBar from "../components/upload/ProgressBar";
import { uploadPDF, getUploads } from "../services/pdfService";

const examTypes = [
    { value: "MAIN", label: "Main Exam" },
    { value: "BACK", label: "Back Exam" },
    { value: "PRACTICAL", label: "Practical" },
];

export default function UploadPDF() {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [examType, setExamType] = useState("MAIN");
    const [progress, setProgress] = useState(0);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadUploads();
    }, []);

    const loadUploads = async () => {
        try {
            setLoading(true);
            const res = await getUploads();
            setUploads(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load uploads");
        } finally {
            setLoading(false);
        }
    };

    const selectFile = (selectedFile) => {
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error("PDF must be 10MB or smaller");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please choose a PDF file first");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("pdf", file);
            formData.append("examType", examType);
            formData.append("title", file.name.replace(/\.pdf$/i, ""));

            await uploadPDF(formData, (event) => {
                if (!event.total) return;
                setProgress(Math.round((event.loaded * 100) / event.total));
            });

            toast.success("PDF uploaded successfully");
            setProgress(0);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            loadUploads();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload PDF");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>
            <div className="upload-pdf-page">
                <div className="upload-hero">
                    <div>
                        <p className="page-kicker">Datesheet Upload</p>
                        <h1>Upload Datesheet PDF</h1>
                        <p className="page-subtitle">
                            Upload a validated PDF for parsing and datesheet workflow processing.
                        </p>
                    </div>
                </div>

                <div className="upload-grid">
                    <section className="upload-panel">
                        <div className="panel-topline">
                            <h2>New Upload</h2>
                            <span>PDF up to 10MB</span>
                        </div>

                        <div className="exam-type-selector" role="group" aria-label="Exam type">
                            {examTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    className={examType === type.value ? "is-active" : ""}
                                    onClick={() => setExamType(type.value)}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <label className="file-drop-zone">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => selectFile(e.target.files[0])}
                            />
                            <span className="file-drop-title">Choose a PDF file</span>
                            <span className="file-drop-subtitle">
                                {file ? file.name : "Click to browse from your device"}
                            </span>
                        </label>

                        {file && (
                            <UploadCard
                                file={file}
                                onUpload={handleUpload}
                                onRemove={() => {
                                    setFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                uploading={uploading}
                            />
                        )}

                        {progress > 0 && <ProgressBar progress={progress} />}
                    </section>

                    <UploadHistory uploads={uploads} loading={loading} />
                </div>
            </div>
        </Layout>
    );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getParsingJobs } from "../services/parsingJobService";

export default function ParsingJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const res = await getParsingJobs();
            setJobs(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load parsing jobs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">PDF Pipeline</p>
                        <h1>Parsing Jobs</h1>
                        <p className="page-subtitle">Track uploaded PDFs as they move through parsing and review.</p>
                    </div>
                </div>

                <div className="utility-panel">
                    {loading ? <p>Loading parsing jobs...</p> : jobs.length ? (
                        <div className="college-list">
                            <table className="table">
                                <thead><tr><th>PDF</th><th>Status</th><th>Template</th><th>Rows</th><th>Created</th></tr></thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td>{job.uploadedPDF?.originalName || "Uploaded PDF"}</td>
                                            <td>{job.status}</td>
                                            <td>{job.template || "N/A"}</td>
                                            <td>{job.parsedExams?.length || 0}</td>
                                            <td>{job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="upload-empty"><h3>No parsing jobs</h3><p>Jobs will appear here after PDFs are uploaded and processed.</p></div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

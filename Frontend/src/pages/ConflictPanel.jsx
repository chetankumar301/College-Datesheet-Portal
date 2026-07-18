import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { validateGeneratedSchedule } from "../services/examService";

export default function ConflictPanel() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) load();
    }, [id]);

    const load = async () => {
        try {
            setLoading(true);
            const res = await validateGeneratedSchedule(id);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="exams-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Conflicts</p>
                        <h1>Conflict Panel</h1>
                        <p className="page-subtitle">Review availability, warnings, and suggestions.</p>
                    </div>
                </div>

                <div className="college-list-panel">
                    {loading ? (
                        <p>Loading conflicts...</p>
                    ) : (
                        <>
                            <div className="exam-cards">
                                <div className="exam-card">
                                    <strong>Available Days</strong>
                                    <span>{data?.availability?.actualAvailableDays || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Warnings</strong>
                                    <span>{data?.warnings?.length || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Status</strong>
                                    <span>{data?.valid ? "Valid" : "Needs review"}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Rooms</strong>
                                    <span>{data?.resourceSummary?.rooms || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Faculty Conflicts</strong>
                                    <span>{data?.resourceSummary?.facultyClashes || 0}</span>
                                </div>
                            </div>

                            <div className="section-preview" style={{ marginTop: "16px" }}>
                                <h2>Conflict Matrix</h2>
                                <p>
                                    The validation engine checks the live college dataset for cohort overlaps and active back-paper enrollments.
                                </p>
                                <div className="exam-cards">
                                    <div className="exam-card">
                                        <strong>Hard Violations</strong>
                                        <span>{data?.hardViolations?.length || 0}</span>
                                    </div>
                                    <div className="exam-card">
                                        <strong>Suggestions</strong>
                                        <span>{data?.suggestions?.length || 0}</span>
                                    </div>
                                    <div className="exam-card">
                                        <strong>Room Clashes</strong>
                                        <span>{data?.resourceSummary?.roomClashes || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {(data?.warnings || []).length > 0 && (
                                <div className="section-preview" style={{ marginTop: "16px" }}>
                                    <h2>Warnings</h2>
                                    <ul>
                                        {data.warnings.map((warning) => (
                                            <li key={warning}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(data?.suggestions || []).length > 0 && (
                                <div className="section-preview" style={{ marginTop: "16px" }}>
                                    <h2>Suggestions</h2>
                                    <ul>
                                        {data.suggestions.map((suggestion) => (
                                            <li key={suggestion}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

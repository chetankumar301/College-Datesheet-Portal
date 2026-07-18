import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getExaminations } from "../services/examService";

export default function ExaminationList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const summary = {
        total: items.length,
        generated: items.filter((item) => item.status === "generated" || item.status === "published").length,
        draft: items.filter((item) => item.status === "draft").length,
    };

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await getExaminations();
            setItems(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="exams-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Datesheet module</p>
                        <h1>Examinations</h1>
                        <p className="page-subtitle">Create and manage smart examinations.</p>
                    </div>
                    <div className="header-actions-stack">
                        <button className="btn-secondary" onClick={() => navigate("/published")}>
                            Published Datesheets
                        </button>
                        <button className="btn-primary" onClick={() => navigate("/exams/create")}>
                            + Create Examination
                        </button>
                    </div>
                </div>

                <div className="college-list-panel">
                    <div className="exam-cards" style={{ marginBottom: "18px" }}>
                        <div className="exam-card">
                            <strong>Total Exams</strong>
                            <span>{summary.total}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Generated / Published</strong>
                            <span>{summary.generated}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Drafts</strong>
                            <span>{summary.draft}</span>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : items.length ? (
                        <div className="exam-cards">
                            {items.map((exam) => (
                                <button
                                    key={exam._id}
                                    className="exam-card exam-card-button"
                                    onClick={() => navigate(`/exams/${exam._id}`)}
                                >
                                    <strong>{exam.examName}</strong>
                                    <span>{exam.examType}</span>
                                    <span>{exam.status}</span>
                                    <span>
                                        {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "No date"}
                                        {" "}to{" "}
                                        {exam.endDate ? new Date(exam.endDate).toLocaleDateString() : "No date"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p>No examinations yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

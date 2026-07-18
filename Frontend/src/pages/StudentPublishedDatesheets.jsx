import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getStudentPublishedExaminations, getPublishedExaminationPdfUrl } from "../services/examService";
import { useAuth } from "../context/AuthContext";

export default function StudentPublishedDatesheets() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        courseId: "",
        semester: "",
        examType: "",
    });
    const summary = {
        total: items.length,
        currentCourse: items.filter((item) => !filters.courseId || String(item.courseId?._id || item.courseId || "") === String(filters.courseId)).length,
    };

    useEffect(() => {
        if (user?.course && !filters.courseId) {
            setFilters((prev) => ({
                ...prev,
                courseId: user.course?._id || user.course,
                semester: user.semester ? String(user.semester) : "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadItems();
        }
    }, [filters, user]);

    const loadItems = async () => {
        try {
            setLoading(true);
            const res = await getStudentPublishedExaminations({
                courseId: filters.courseId || undefined,
                semester: filters.semester || undefined,
                examType: filters.examType || undefined,
            });
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
                        <p className="page-kicker">Student Portal</p>
                        <h1>Published Datesheets</h1>
                        <p className="page-subtitle">
                            View your college's official published exam schedules.
                        </p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/student/dashboard")}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="college-list-panel">
                    <div className="exam-cards" style={{ marginBottom: "18px" }}>
                        <div className="exam-card">
                            <strong>Available</strong>
                            <span>{summary.total}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Matching Course</strong>
                            <span>{summary.currentCourse}</span>
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Course</label>
                            <select
                                value={filters.courseId}
                                onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                            >
                                <option value="">My course</option>
                                {user?.course ? (
                                    <option value={user?.course?._id || user?.course || ""}>
                                        {user?.course?.courseName || "Current course"}
                                    </option>
                                ) : null}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Semester</label>
                            <select
                                value={filters.semester}
                                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            >
                                <option value="">My semester</option>
                                {user?.semester ? (
                                    <option value={String(user.semester)}>
                                        Semester {user.semester}
                                    </option>
                                ) : null}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "14px" }}>
                        <label>Exam Type</label>
                        <select
                            value={filters.examType}
                            onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
                        >
                            <option value="">All types</option>
                            <option value="main">Main</option>
                            <option value="back">Back</option>
                            <option value="improvement">Improvement</option>
                            <option value="practical">Practical</option>
                        </select>
                    </div>
                </div>

                <div className="college-list-panel">
                    {loading ? (
                        <p>Loading...</p>
                    ) : items.length ? (
                        <div className="exam-cards">
                            {items.map((exam) => (
                                <div key={exam._id} className="exam-card">
                                    <strong>{exam.examName}</strong>
                                    <span>Type: {exam.examType}</span>
                                    <span>
                                        Published: {exam.publishedAt ? new Date(exam.publishedAt).toLocaleDateString() : "N/A"}
                                    </span>
                                    <button
                                        className="btn-primary"
                                        onClick={() =>
                                            window.open(
                                                getPublishedExaminationPdfUrl(exam._id, { format: "full" }),
                                                "_blank"
                                            )
                                        }
                                    >
                                        View PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No published datesheets available for your college.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

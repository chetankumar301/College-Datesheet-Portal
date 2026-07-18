import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAcademicScope, getPublishedExaminations, getPublishedExaminationPdfUrl } from "../services/examService";
import { useNavigate } from "react-router-dom";

export default function Published() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [scope, setScope] = useState({ courses: [], semesters: [] });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        courseId: "",
        semester: "",
        examType: "",
    });
    const summary = {
        total: items.length,
        main: items.filter((item) => item.examType === "main").length,
        back: items.filter((item) => item.examType === "back").length,
    };

    useEffect(() => {
        loadScope();
    }, []);

    useEffect(() => {
        loadItems();
    }, [filters]);

    const loadScope = async () => {
        try {
            const res = await getAcademicScope();
            setScope({
                courses: res.data?.courses || [],
                semesters: res.data?.semesters || [],
            });
        } catch (err) {
            // best-effort load
        }
    };

    const loadItems = async () => {
        try {
            setLoading(true);
            const res = await getPublishedExaminations({
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
                        <p className="page-kicker">Published</p>
                        <h1>Published Datesheets</h1>
                        <p className="page-subtitle">View, filter, and export published exam schedules.</p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/exams")}>
                        Open Exams
                    </button>
                </div>

                <div className="college-list-panel">
                    <div className="exam-cards" style={{ marginBottom: "18px" }}>
                        <div className="exam-card">
                            <strong>Published</strong>
                            <span>{summary.total}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Main Exams</strong>
                            <span>{summary.main}</span>
                        </div>
                        <div className="exam-card">
                            <strong>Back Exams</strong>
                            <span>{summary.back}</span>
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Course</label>
                            <select
                                value={filters.courseId}
                                onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                            >
                                <option value="">All courses</option>
                                {scope.courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Semester</label>
                            <select
                                value={filters.semester}
                                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            >
                                <option value="">All semesters</option>
                                {scope.semesters.map((semester) => (
                                    <option key={semester._id} value={semester.code || semester.name}>
                                        {semester.name}
                                    </option>
                                ))}
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
                                    <span>Status: {exam.status}</span>
                                    <span>
                                        Published:{" "}
                                        {exam.publishedAt
                                            ? new Date(exam.publishedAt).toLocaleDateString()
                                            : "N/A"}
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
                                        Download PDF
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() =>
                                            window.open(
                                                getPublishedExaminationPdfUrl(exam._id, { format: "course" }),
                                                "_blank"
                                            )
                                        }
                                    >
                                        Course PDF
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() =>
                                            window.open(
                                                getPublishedExaminationPdfUrl(exam._id, { format: "semester" }),
                                                "_blank"
                                            )
                                        }
                                    >
                                        Semester PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No published schedules yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

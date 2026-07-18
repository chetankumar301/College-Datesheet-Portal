import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getPublishedExaminations } from "../services/examService";

export default function DatesheetCalendar() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            setLoading(true);
            const res = await getPublishedExaminations();
            setItems(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    const grouped = useMemo(() => {
        return items.reduce((acc, exam) => {
            const key = exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "Unscheduled";
            acc[key] = acc[key] || [];
            acc[key].push(exam);
            return acc;
        }, {});
    }, [items]);

    return (
        <Layout>
            <div className="exams-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Calendar</p>
                        <h1>Datesheet Calendar</h1>
                        <p className="page-subtitle">Visual exam placement view for quick review.</p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/published")}>
                        Open Published
                    </button>
                </div>

                <div className="college-list-panel">
                    {loading ? (
                        <p>Loading calendar...</p>
                    ) : items.length ? (
                        <div className="calendar-grid">
                            {Object.entries(grouped).map(([date, exams]) => (
                                <div key={date} className="calendar-day">
                                    <div className="panel-topline">
                                        <h2>{date}</h2>
                                        <span>{exams.length} exams</span>
                                    </div>
                                    <div className="status-grid">
                                        {exams.map((exam) => (
                                            <div key={exam._id} className="status-item">
                                                <span className="status-dot"></span>
                                                <span>
                                                    {exam.examName} - {exam.examType}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No scheduled exams to show yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

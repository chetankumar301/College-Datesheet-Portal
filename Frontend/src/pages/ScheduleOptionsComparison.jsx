import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getScheduleReview } from "../services/examService";

export default function ScheduleOptionsComparison() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) load();
    }, [id]);

    const load = async () => {
        try {
            setLoading(true);
            const res = await getScheduleReview(id);
            setReview(res);
        } catch (err) {
            toast.error("Failed to load schedule comparison");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="exams-page">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Review</p>
                        <h1>Schedule Options</h1>
                        <p className="page-subtitle">Compare generated schedules and validation warnings.</p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/exams")}>
                        Back to Exams
                    </button>
                </div>

                <div className="college-list-panel">
                    {loading ? (
                        <p>Loading comparison...</p>
                    ) : (
                        <>
                            <div className="panel-topline">
                                <h2>Availability Summary</h2>
                                <span>{review?.validation?.availability?.actualAvailableDays || 0} usable days</span>
                            </div>
                            <div className="exam-cards">
                                <div className="exam-card">
                                    <strong>Valid Schedule</strong>
                                    <span>{review?.validation?.valid ? "Yes" : "No"}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Total Calendar Days</strong>
                                    <span>{review?.validation?.availability?.totalCalendarDays || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Warnings</strong>
                                    <span>{review?.validation?.warnings?.length || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Rooms</strong>
                                    <span>{review?.validation?.resourceSummary?.rooms || 0}</span>
                                </div>
                                <div className="exam-card">
                                    <strong>Faculty Conflicts</strong>
                                    <span>{review?.validation?.resourceSummary?.facultyClashes || 0}</span>
                                </div>
                            </div>

                            {(review?.validation?.suggestions || []).length > 0 && (
                                <div className="section-preview" style={{ marginTop: "16px" }}>
                                    <h2>Suggestions</h2>
                                    <ul>
                                        {review.validation.suggestions.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {review?.comparison?.summary && (
                                <div className="section-preview" style={{ marginTop: "16px" }}>
                                    <h2>Generation Summary</h2>
                                    <div className="exam-cards">
                                        <div className="exam-card">
                                            <strong>Students</strong>
                                            <span>{review.comparison.summary.students}</span>
                                        </div>
                                        <div className="exam-card">
                                            <strong>Back Papers</strong>
                                            <span>{review.comparison.summary.backPapers}</span>
                                        </div>
                                        <div className="exam-card">
                                            <strong>Subjects</strong>
                                            <span>{review.comparison.summary.totalSubjects}</span>
                                        </div>
                                        <div className="exam-card">
                                            <strong>Available Days</strong>
                                            <span>{review.comparison.summary.availableDays}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {review?.comparison?.conflictMatrix && (
                                <div className="section-preview" style={{ marginTop: "16px" }}>
                                    <h2>Conflict Matrix</h2>
                                    <p>
                                        Subject overlap rows are based on current student cohorts and active back-paper enrollments.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {review?.comparison?.options?.map((option) => (
                    <div key={option.name} className="college-list-panel">
                        <div className="panel-topline">
                            <h2>{option.name}</h2>
                            <span>Quality: {option.qualityScore}/100</span>
                        </div>
                        <div className="exam-cards">
                            <div className="exam-card">
                                <strong>Total Exam Slots</strong>
                                <span>{option.schedule?.length || 0}</span>
                            </div>
                            <div className="exam-card">
                                <strong>First Subject</strong>
                                <span>{option.schedule?.[0]?.subjectId?.subjectName || option.schedule?.[0]?.subjectId || "N/A"}</span>
                            </div>
                            <div className="exam-card">
                                <strong>Quality Status</strong>
                                <span>{option.qualityScore >= 80 ? "Strong" : "Needs tuning"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

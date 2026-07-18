import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getPlatformAnalytics } from "../services/analyticsService";
import { getCollegeStats } from "../services/collegeService";

const metricValue = (value) => Number(value || 0).toLocaleString();

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [collegeStats, setCollegeStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, statsRes] = await Promise.allSettled([
                getPlatformAnalytics(),
                getCollegeStats(),
            ]);

            if (analyticsRes.status === "fulfilled") {
                setAnalytics(analyticsRes.value.data || {});
            } else {
                console.error("Platform analytics failed:", analyticsRes.reason);
                setAnalytics({});
            }

            if (statsRes.status === "fulfilled") {
                setCollegeStats(statsRes.value.data || {});
            } else {
                console.error("College stats failed:", statsRes.reason);
                setCollegeStats({});
            }
        } catch (err) {
            console.error("Failed to load analytics:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { label: "Create College", path: "/super-admin/colleges", primary: true },
        { label: "View All Colleges", path: "/super-admin/colleges" },
        { label: "Manage Subscriptions", path: "/super-admin/subscriptions" },
        { label: "View Audit Logs", path: "/super-admin/audit-logs" },
    ];

    const summary = useMemo(
        () => [
            {
                title: "Total Colleges",
                value: metricValue(analytics?.totalColleges ?? collegeStats?.totalColleges),
                note: `Active: ${metricValue(analytics?.activeColleges ?? collegeStats?.activeColleges)}`,
            },
            {
                title: "Total Students",
                value: metricValue(analytics?.totalStudents ?? collegeStats?.totalStudents),
                note: `New (30d): ${metricValue(analytics?.newStudents)}`,
            },
            {
                title: "Total Admins",
                value: metricValue(analytics?.totalAdmins),
                note: `Sub Super Admins: ${metricValue(analytics?.totalSubSuperAdmins)}`,
            },
            {
                title: "Total Revenue",
                value: `Rs. ${metricValue(analytics?.totalRevenue)}`,
                note: `Monthly: Rs. ${metricValue(analytics?.monthlyRevenue)}`,
            },
        ],
        [analytics, collegeStats]
    );

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-message">
                    <h2>Error loading dashboard</h2>
                    <p>{error}</p>
                    <button onClick={() => {
                        setError(null);
                        setLoading(true);
                        loadData();
                    }}>Retry</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard-shell">
                <div className="dashboard-hero">
                    <div>
                        <p className="dashboard-kicker">Platform overview</p>
                        <h1>Super Admin Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Track college growth, revenue, and operational health from one place.
                        </p>
                    </div>
                    <button className="btn-secondary" onClick={() => navigate("/super-admin/colleges")}>
                        Manage Colleges
                    </button>
                </div>

                <div className="stats-grid">
                    {summary.map((card) => (
                        <div key={card.title} className="stat-card">
                            <h3>{card.title}</h3>
                            <p className="stat-number">{card.value}</p>
                            <p className="stat-label">{card.note}</p>
                        </div>
                    ))}
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>College Status</h2>
                        <div className="status-grid">
                            <div className="status-item active">
                                <span className="status-dot"></span>
                                <span>Active: {metricValue(analytics?.activeColleges)}</span>
                            </div>
                            <div className="status-item trial">
                                <span className="status-dot"></span>
                                <span>Trial: {metricValue(analytics?.trialColleges)}</span>
                            </div>
                            <div className="status-item suspended">
                                <span className="status-dot"></span>
                                <span>Suspended: {metricValue(analytics?.suspendedColleges)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    className={action.primary ? "btn-primary" : "btn-secondary"}
                                    onClick={() => navigate(action.path)}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Platform Highlights</h2>
                        <div className="section-preview">
                            <h2>Current health</h2>
                            <ul>
                                <li>College count and status distribution</li>
                                <li>Revenue movement across plans</li>
                                <li>Student and admin growth trends</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

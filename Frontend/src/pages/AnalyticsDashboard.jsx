import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { getPlatformAnalytics } from "../services/analyticsService";
import { useAuth } from "../context/AuthContext";

const metricValue = (value) => Number(value || 0).toLocaleString();

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const res = await getPlatformAnalytics();
            setAnalytics(res.data || {});
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const cards = useMemo(
        () => [
            {
                title: "Total Colleges",
                value: metricValue(analytics?.totalColleges),
                note: `Active: ${metricValue(analytics?.activeColleges)}`,
            },
            {
                title: "Total Students",
                value: metricValue(analytics?.totalStudents),
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
        [analytics]
    );

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="analytics-page">
                <div className="dashboard-hero">
                    <div>
                        <p className="dashboard-kicker">Platform overview</p>
                        <h1>Analytics Dashboard</h1>
                        <p className="dashboard-subtitle">
                            {user?.role === "super_admin"
                                ? "Monitor platform growth and revenue from one place."
                                : "Monitor your current institution activity and growth."}
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    {cards.map((card) => (
                        <div key={card.title} className="stat-card">
                            <h3>{card.title}</h3>
                            <p className="stat-number">{card.value}</p>
                            <p className="stat-label">{card.note}</p>
                        </div>
                    ))}
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>Revenue Health</h2>
                        <div className="status-grid">
                            <div className="status-item active">
                                <span className="status-dot"></span>
                                <span>Peak month: {metricValue(analytics?.peakMonthRevenue)}</span>
                            </div>
                            <div className="status-item trial">
                                <span className="status-dot"></span>
                                <span>Recurring revenue: {metricValue(analytics?.recurringRevenue)}</span>
                            </div>
                            <div className="status-item suspended">
                                <span className="status-dot"></span>
                                <span>Pending dues: {metricValue(analytics?.pendingRevenue)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Revenue By Plan</h2>
                        {analytics?.revenueByPlan && Object.keys(analytics.revenueByPlan).length ? (
                            <div className="analytics-list">
                                {Object.entries(analytics.revenueByPlan).map(([plan, amount]) => (
                                    <div key={plan} className="analytics-row">
                                        <span>{plan}</span>
                                        <span>Rs. {metricValue(amount)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No plan revenue data yet.</p>
                        )}
                    </div>

                    <div className="section">
                        <h2>Operational Notes</h2>
                        <div className="section-preview">
                            <h2>What this dashboard shows</h2>
                            <ul>
                                <li>College growth and status distribution</li>
                                <li>Revenue totals and plan-level breakdowns</li>
                                <li>Student and admin totals for the platform</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

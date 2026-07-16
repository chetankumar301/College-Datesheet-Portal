import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getPlatformAnalytics, getRevenueAnalytics } from "../services/analyticsService";
import { getRevenueAnalytics as getSubRevenueAnalytics } from "../services/subscriptionService";
import { useAuth } from "../context/AuthContext";

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            if (user?.role === "super_admin") {
                const [analyticsRes, revenueRes] = await Promise.all([
                    getPlatformAnalytics(),
                    getSubRevenueAnalytics()
                ]);
                setAnalytics(analyticsRes.data);
                setRevenue(revenueRes.data);
            }
        } catch (err) {
            console.error("Failed to load analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="analytics-dashboard">
                <h1>Platform Analytics</h1>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{analytics?.totalRevenue?.toLocaleString() || 0}</p>
                        <p className="stat-label">Monthly: ₹{analytics?.monthlyRevenue?.toLocaleString() || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Colleges</h3>
                        <p className="stat-number">{analytics?.totalColleges || 0}</p>
                        <p className="stat-label">Active: {analytics?.activeColleges || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <p className="stat-number">{analytics?.totalStudents || 0}</p>
                        <p className="stat-label">New (30d): {analytics?.newStudents || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Subscriptions</h3>
                        <p className="stat-number">{revenue?.totalSubscriptions || 0}</p>
                        <p className="stat-label">Active subscriptions</p>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>Revenue by Plan</h2>
                        <div className="revenue-by-plan">
                            {revenue?.revenueByPlan && Object.entries(revenue.revenueByPlan).map(([plan, amount]) => (
                                <div key={plan} className="revenue-item">
                                    <span className="plan-name">{plan.toUpperCase()}</span>
                                    <span className="amount">₹{amount?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Revenue by College</h2>
                        <div className="revenue-by-college">
                            {revenue?.revenueByCollege && Object.entries(revenue.revenueByCollege).map(([college, amount]) => (
                                <div key={college} className="revenue-item">
                                    <span className="college-name">{college}</span>
                                    <span className="amount">₹{amount?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Student Distribution</h2>
                        <div className="student-distribution">
                            {analytics?.studentDistribution?.slice(0, 10).map((item) => (
                                <div key={item._id} className="distribution-item">
                                    <span>{item.collegeName} ({item.collegeCode})</span>
                                    <span className="count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Growth Metrics (Last 30 Days)</h2>
                        <div className="growth-metrics">
                            <div className="growth-item">
                                <span>New Colleges</span>
                                <span className="count">{analytics?.newColleges || 0}</span>
                            </div>
                            <div className="growth-item">
                                <span>New Students</span>
                                <span className="count">{analytics?.newStudents || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

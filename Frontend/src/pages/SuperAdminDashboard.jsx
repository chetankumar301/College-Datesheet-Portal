import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getPlatformAnalytics } from "../services/analyticsService";
import { getCollegeStats } from "../services/collegeService";

export default function SuperAdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [collegeStats, setCollegeStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, statsRes] = await Promise.all([
                getPlatformAnalytics(),
                getCollegeStats()
            ]);
            setAnalytics(analyticsRes.data);
            setCollegeStats(statsRes.data);
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
            <div className="super-admin-dashboard">
                <h1>Super Admin Dashboard</h1>
                
                <div className="stats-grid">
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
                        <h3>Total Admins</h3>
                        <p className="stat-number">{analytics?.totalAdmins || 0}</p>
                        <p className="stat-label">Sub Super Admins: {analytics?.totalSubSuperAdmins || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{analytics?.totalRevenue?.toLocaleString() || 0}</p>
                        <p className="stat-label">Monthly: ₹{analytics?.monthlyRevenue?.toLocaleString() || 0}</p>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>College Status</h2>
                        <div className="status-grid">
                            <div className="status-item active">
                                <span className="status-dot"></span>
                                <span>Active: {analytics?.activeColleges || 0}</span>
                            </div>
                            <div className="status-item trial">
                                <span className="status-dot"></span>
                                <span>Trial: {analytics?.trialColleges || 0}</span>
                            </div>
                            <div className="status-item suspended">
                                <span className="status-dot"></span>
                                <span>Suspended: {analytics?.suspendedColleges || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <button className="btn-primary">Create College</button>
                            <button className="btn-secondary">View All Colleges</button>
                            <button className="btn-secondary">Manage Subscriptions</button>
                            <button className="btn-secondary">View Audit Logs</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getCollegeAnalytics } from "../services/analyticsService";
import { useAuth } from "../context/AuthContext";

export default function SubSuperAdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.college) {
            loadAnalytics();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadAnalytics = async () => {
        try {
            const res = await getCollegeAnalytics(user.college);
            setAnalytics(res.data);
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
            <div className="sub-super-admin-dashboard">
                <h1>College Dashboard</h1>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <p className="stat-number">{analytics?.totalStudents || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Admins</h3>
                        <p className="stat-number">{analytics?.totalAdmins || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Total Datesheets</h3>
                        <p className="stat-number">{analytics?.totalDatesheets || 0}</p>
                        <p className="stat-label">Published: {analytics?.publishedDatesheets || 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Pending Approval</h3>
                        <p className="stat-number">{analytics?.pendingDatesheets || 0}</p>
                        <p className="stat-label">Need Review</p>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section">
                        <h2>Students by Course</h2>
                        <div className="course-stats">
                            {analytics?.studentsByCourse?.length ? analytics.studentsByCourse.map((item) => (
                                <div key={item._id} className="course-stat-item">
                                    <span>{item.courseName} ({item.courseCode})</span>
                                    <span className="count">{item.count}</span>
                                </div>
                            )) : <p>No course data yet.</p>}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Students by Semester</h2>
                        <div className="semester-stats">
                            {analytics?.studentsBySemester?.length ? analytics.studentsBySemester.map((item) => (
                                <div key={item._id} className="semester-stat-item">
                                    <span>Semester {item._id}</span>
                                    <span className="count">{item.count}</span>
                                </div>
                            )) : <p>No semester data yet.</p>}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <button className="btn-primary" type="button" onClick={() => navigate("/sub-super-admin/datesheet-approval")}>View Pending Approvals</button>
                            <button className="btn-secondary" type="button" onClick={() => navigate("/sub-super-admin/admin-management")}>Manage Admins</button>
                            <button className="btn-secondary" type="button" onClick={() => navigate("/sub-super-admin/audit-logs")}>View Audit Logs</button>
                            <button className="btn-secondary" type="button" onClick={() => navigate("/sub-super-admin/reports")}>View Reports</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

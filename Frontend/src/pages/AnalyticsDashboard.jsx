import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
    getRevenueAnalytics,
    getStudentAnalytics,
    getAllCollegesAnalytics,
} from "../services/analyticsService";
import { useAuth } from "../context/AuthContext";

export default function AnalyticsDashboard() {
    const { user } = useAuth();

    const [revenue, setRevenue] = useState({});
    const [studentAnalytics, setStudentAnalytics] = useState({});
    const [collegeAnalytics, setCollegeAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            if (user?.role === "super_admin") {
                const [
                    revenueRes,
                    studentRes,
                    collegeRes,
                ] = await Promise.all([
                    getRevenueAnalytics(),
                    getStudentAnalytics(),
                    getAllCollegesAnalytics(),
                ]);

                setRevenue(revenueRes || {});
                setStudentAnalytics(studentRes || {});
                setCollegeAnalytics(collegeRes || []);
            }
        } catch (error) {
            console.error("Failed to load analytics:", error);
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
                        <p className="stat-number">
                            ₹{Number(revenue.totalRevenue || 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <p className="stat-number">
                            {studentAnalytics.totalStudents || 0}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Colleges</h3>
                        <p className="stat-number">
                            {collegeAnalytics.length}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>Monthly Revenue</h3>
                        <p className="stat-number">
                            ₹{Number(revenue.monthlyRevenue || 0).toLocaleString()}
                        </p>
                    </div>

                </div>

                <div className="dashboard-sections">

                    <div className="section">
                        <h2>Revenue By Plan</h2>

                        {revenue.revenueByPlan &&
                            Object.entries(revenue.revenueByPlan).map(
                                ([plan, amount]) => (
                                    <div
                                        key={plan}
                                        className="revenue-item"
                                    >
                                        <span>{plan}</span>
                                        <span>
                                            ₹{Number(amount).toLocaleString()}
                                        </span>
                                    </div>
                                )
                            )}
                    </div>

                    <div className="section">
                        <h2>Colleges</h2>

                        {collegeAnalytics.length > 0 ? (
                            collegeAnalytics.map((college, index) => (
                                <div
                                    key={college._id || index}
                                    className="revenue-item"
                                >
                                    <span>
                                        {college.name ||
                                            college.collegeName ||
                                            "College"}
                                    </span>

                                    <span>
                                        {college.studentCount ||
                                            college.totalStudents ||
                                            0}{" "}
                                        Students
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>No colleges found.</p>
                        )}
                    </div>

                    <div className="section">
                        <h2>Student Analytics</h2>

                        <div className="growth-item">
                            <span>Total Students</span>
                            <span className="count">
                                {studentAnalytics.totalStudents || 0}
                            </span>
                        </div>

                        <div className="growth-item">
                            <span>New Students</span>
                            <span className="count">
                                {studentAnalytics.newStudents || 0}
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </Layout>
    );
}
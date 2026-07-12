import { useEffect, useState } from "react";
import api from "../services/api";

import Layout from "../components/layout/Layout";
import Card from "../components/common/Card";

import {
  FaUserGraduate,
  FaFilePdf,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBell,
  FaBook
} from "react-icons/fa";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const res = await api.get("/dashboard");

            setDashboard(res.data.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <Layout>
                <h2>Loading Dashboard...</h2>
            </Layout>
        );

    }

    if (!dashboard) {

        return (
            <Layout>
                <h2>Unable to load dashboard.</h2>
            </Layout>
        );

    }

    return (

        <Layout>

            <h1 className="dashboard-title">
                Admin Dashboard
            </h1>

            {/* Dashboard Cards */}

            <div className="cards">

                <Card
                title="Students"
                value={dashboard.users.students}
                icon={<FaUserGraduate/>}
                color="#2563eb"
                />

                <Card
                title="Uploaded PDFs"
                value={dashboard.uploadedPDFs}
                icon={<FaFilePdf/>}
                color="#16a34a"
                />

                <Card
                title="Schedules"
                value={dashboard.schedules}
                icon={<FaCalendarAlt/>}
                color="#ea580c"
                />

                <Card
                title="Complaints"
                value={dashboard.complaints}
                icon={<FaExclamationTriangle/>}
                color="#dc2626"
                />

                <Card
                title="Notifications"
                value={dashboard.notifications}
                icon={<FaBell/>}
                color="#9333ea"
                />

                <Card
                title="Subjects"
                value={dashboard.subjects}
                icon={<FaBook/>}
                color="#0891b2"
                />

            </div>

            {/* Recent Activity */}

            <div className="dashboard-sections">

                <div className="dashboard-box">

                    <h2>Recent Uploaded PDFs</h2>

                    <ul>

                        {dashboard.recentPDFs?.length > 0 ? (

                            dashboard.recentPDFs.map((pdf) => (

                                <li key={pdf._id}>

                                    {pdf.fileName || pdf.originalName || "Uploaded PDF"}

                                </li>

                            ))

                        ) : (

                            <li>No PDF uploaded yet.</li>

                        )}

                    </ul>

                </div>

                <div className="dashboard-box">

                    <h2>Recent Complaints</h2>

                    <ul>

                        {dashboard.recentComplaints?.length > 0 ? (

                            dashboard.recentComplaints.map((complaint) => (

                                <li key={complaint._id}>

                                    {complaint.student?.name} - {complaint.status}

                                </li>

                            ))

                        ) : (

                            <li>No complaints.</li>

                        )}

                    </ul>

                </div>

                <div className="dashboard-box">

                    <h2>Recent Published Datesheets</h2>

                    <ul>

                        {dashboard.recentSchedules?.length > 0 ? (

                            dashboard.recentSchedules.map((schedule) => (

                                <li key={schedule._id}>

                                    {schedule.title}

                                </li>

                            ))

                        ) : (

                            <li>No schedules published.</li>

                        )}

                    </ul>

                </div>

            </div>

        </Layout>

    );

}
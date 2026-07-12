import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import StudentProfileCard from "../components/student/StudentProfileCard";

import NextExamCard from "../components/student/NextExamCard";

import api from "../services/api";

export default function StudentDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const res = await api.get("/dashboard");

            setDashboard(res.data.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

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

    return (

        <Layout>

            <h1>

                Student Dashboard

            </h1>

            <div className="student-dashboard">

                <StudentProfileCard />

                <NextExamCard

                    exam={dashboard.nextExam}

                />

            </div>

            <div className="student-grid">

                <div className="student-box">

                    <h2>

                        📚 Current Datesheet

                    </h2>

                    <button>

                        View Datesheet

                    </button>

                </div>

                <div className="student-box">

                    <h2>

                        📖 Back Paper Datesheet

                    </h2>

                    <button>

                        View Back Papers

                    </button>

                </div>

                <div className="student-box">

                    <h2>

                        🔔 Notifications

                    </h2>

                    <p>

                        {

                            dashboard.notifications.length

                        }

                        Notifications

                    </p>

                </div>

                <div className="student-box">

                    <h2>

                        ⚠ Complaints

                    </h2>

                    <p>

                        {

                            dashboard.pendingComplaints

                        }

                        Pending

                    </p>

                </div>

            </div>

        </Layout>

    );

}
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getStudents } from "../services/studentService";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const res = await getStudents();
            setStudents(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">College Records</p>
                        <h1>Students</h1>
                        <p className="page-subtitle">View students associated with your college scope.</p>
                    </div>
                </div>

                <div className="utility-panel">
                    {loading ? <p>Loading students...</p> : students.length ? (
                        <div className="college-list">
                            <table className="table">
                                <thead><tr><th>Name</th><th>Email</th><th>Enrollment</th><th>Course</th><th>Branch</th><th>Semester</th></tr></thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.enrollmentNo || "N/A"}</td>
                                            <td>{student.course?.name || "N/A"}</td>
                                            <td>{student.branch?.name || "N/A"}</td>
                                            <td>{student.semester}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="upload-empty"><h3>No students found</h3><p>Students will appear here after they are added.</p></div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

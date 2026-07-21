import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getSubjects } from "../services/subjectService";

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const res = await getSubjects();
            setSubjects(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load subjects");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">Academic Catalog</p>
                        <h1>Subjects</h1>
                        <p className="page-subtitle">Browse subjects used for timetable parsing and datesheet generation.</p>
                    </div>
                </div>

                <div className="utility-panel">
                    {loading ? <p>Loading subjects...</p> : subjects.length ? (
                        <div className="college-list">
                            <table className="table">
                                <thead><tr><th>Code</th><th>Name</th><th>Course</th><th>Branch</th><th>Semester</th><th>Type</th><th>Credits</th></tr></thead>
                                <tbody>
                                    {subjects.map((subject) => (
                                        <tr key={subject._id}>
                                            <td>{subject.subjectCode}</td>
                                            <td>{subject.subjectName}</td>
                                            <td>{subject.course?.name || "N/A"}</td>
                                            <td>{subject.branch?.name || "N/A"}</td>
                                            <td>{subject.semester}</td>
                                            <td>{subject.subjectType}</td>
                                            <td>{subject.credits}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="upload-empty"><h3>No subjects found</h3><p>Subjects will appear here after academic setup.</p></div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

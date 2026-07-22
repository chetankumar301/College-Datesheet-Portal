import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { createNotification, deleteNotification, getNotifications, markAllAsRead, markAsRead } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

const emptyComposer = {
    title: "",
    message: "",
    type: "UPDATE",
    audience: "all",
    course: "",
    semester: "",
    students: "",
};

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [composer, setComposer] = useState(emptyComposer);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications();
            setNotifications(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        await markAsRead(id);
        loadNotifications();
    };

    const handleMarkAll = async () => {
        await markAllAsRead();
        toast.success("All notifications marked as read");
        loadNotifications();
    };

    const handleDelete = async (id) => {
        await deleteNotification(id);
        toast.success("Notification deleted");
        loadNotifications();
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            const res = await createNotification({
                ...composer,
                students: composer.students.split(",").map((item) => item.trim()).filter(Boolean),
            });
            toast.success(`Notification sent to ${res.count || 0} students`);
            setComposer(emptyComposer);
            loadNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send notification");
        }
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">Inbox</p>
                        <h1>Notifications</h1>
                        <p className="page-subtitle">Review system alerts, reminders, and datesheet updates.</p>
                    </div>
                    <button className="btn-primary" type="button" onClick={handleMarkAll}>Mark All Read</button>
                </div>

                {user?.role === "admin" && (
                    <div className="utility-panel">
                        <h2>Create Notification</h2>
                        <form className="college-form" onSubmit={handleSend}>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input value={composer.title} onChange={(e) => setComposer({ ...composer, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={composer.type} onChange={(e) => setComposer({ ...composer, type: e.target.value })}>
                                        <option value="UPDATE">Update</option>
                                        <option value="DATESHEET">Datesheet</option>
                                        <option value="COMPLAINT">Complaint</option>
                                        <option value="REMINDER">Reminder</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea rows="3" value={composer.message} onChange={(e) => setComposer({ ...composer, message: e.target.value })} required />
                            </div>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Audience</label>
                                    <select value={composer.audience} onChange={(e) => setComposer({ ...composer, audience: e.target.value })}>
                                        <option value="all">All Students</option>
                                        <option value="course">Selected Course</option>
                                        <option value="semester">Selected Semester</option>
                                        <option value="individual">Individual Students</option>
                                    </select>
                                </div>
                                {composer.audience === "course" && (
                                    <div className="form-group">
                                        <label>Course ID</label>
                                        <input value={composer.course} onChange={(e) => setComposer({ ...composer, course: e.target.value })} />
                                    </div>
                                )}
                                {composer.audience === "semester" && (
                                    <div className="form-group">
                                        <label>Semester</label>
                                        <input type="number" min="1" max="12" value={composer.semester} onChange={(e) => setComposer({ ...composer, semester: e.target.value })} />
                                    </div>
                                )}
                                {composer.audience === "individual" && (
                                    <div className="form-group">
                                        <label>Student IDs</label>
                                        <input placeholder="Comma separated student IDs" value={composer.students} onChange={(e) => setComposer({ ...composer, students: e.target.value })} />
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button className="btn-primary" type="submit">Send Notification</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="utility-panel">
                    {loading ? <p>Loading notifications...</p> : notifications.length ? (
                        <div className="stack-list">
                            {notifications.map((item) => (
                                <div key={item._id} className={`utility-card ${item.isRead ? "" : "is-unread"}`}>
                                    <div>
                                        <h2>{item.title}</h2>
                                        <p>{item.message}</p>
                                        <span>{item.type} · {new Date(item.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="table-actions">
                                        {!item.isRead && <button className="btn-edit" type="button" onClick={() => handleRead(item._id)}>Mark Read</button>}
                                        <button className="btn-delete" type="button" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="upload-empty"><h3>No notifications</h3><p>You are all caught up.</p></div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

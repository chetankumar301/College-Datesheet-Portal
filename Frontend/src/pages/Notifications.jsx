import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { deleteNotification, getNotifications, markAllAsRead, markAsRead } from "../services/notificationService";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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

import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAllAuditLogs } from "../services/auditLogService";
import { useAuth } from "../context/AuthContext";

export default function AuditLogViewer() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: "",
        page: 1,
        limit: 50,
    });

    useEffect(() => {
        loadLogs();
    }, [filters]);

    const loadLogs = async () => {
        try {
            const res = await getAllAuditLogs(filters);
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to load audit logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
            page: 1,
        });
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
            <div className="audit-log-viewer">
                <h1>Audit Logs</h1>
                
                <div className="filters">
                    <select
                        name="action"
                        value={filters.action}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Actions</option>
                        <option value="login">Login</option>
                        <option value="create_admin">Create Admin</option>
                        <option value="delete_admin">Delete Admin</option>
                        <option value="upload_pdf">Upload PDF</option>
                        <option value="approve_datesheet">Approve Datesheet</option>
                        <option value="reject_datesheet">Reject Datesheet</option>
                        <option value="publish_datesheet">Publish Datesheet</option>
                    </select>
                </div>

                <div className="logs-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>College</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>
                                        <span className="action-badge">{log.action}</span>
                                    </td>
                                    <td>{log.user?.name || log.admin?.name || "N/A"}</td>
                                    <td>{log.college?.name || "N/A"}</td>
                                    <td>{log.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button 
                        disabled={filters.page === 1}
                        onClick={() => setFilters({...filters, page: filters.page - 1})}
                    >
                        Previous
                    </button>
                    <span>Page {filters.page}</span>
                    <button onClick={() => setFilters({...filters, page: filters.page + 1})}>
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}

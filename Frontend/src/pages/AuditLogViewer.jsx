import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAllAuditLogs } from "../services/auditLogService";
import { useAuth } from "../context/AuthContext";

const actions = [
    "login",
    "logout",
    "create_admin",
    "update_admin",
    "delete_admin",
    "upload_pdf",
    "submit_approval",
    "approve_datesheet",
    "reject_datesheet",
    "publish_datesheet",
    "create_notification",
    "resolve_complaint",
];

export default function AuditLogViewer() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        action: "",
        role: "",
        startDate: "",
        endDate: "",
        page: 1,
        limit: 20,
    });

    const isSubSuperAdmin = user?.role === "sub_super_admin";

    useEffect(() => {
        loadLogs();
    }, [filters]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await getAllAuditLogs(filters);
            setLogs(res.data || []);
            setPagination(res.pagination || { page: filters.page, pages: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const filteredSummary = useMemo(() => ({
        logins: logs.filter((log) => log.action === "login").length,
        adminActivities: logs.filter((log) => String(log.action || "").includes("admin")).length,
        collegeActivities: logs.filter((log) => log.college).length,
    }), [logs]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const exportCsv = () => {
        const header = ["Date", "User", "Role", "Action", "College", "IP", "Details"];
        const rows = logs.map((log) => [
            new Date(log.timestamp || log.createdAt).toLocaleString(),
            log.admin?.name || log.user?.name || "N/A",
            log.admin?.role || log.user?.role || "N/A",
            log.action || "N/A",
            log.college?.name || "N/A",
            log.ipAddress || "N/A",
            log.description || "",
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "audit-logs.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">{isSubSuperAdmin ? "College audit" : "Platform audit"}</p>
                        <h1>Audit Logs</h1>
                        <p className="page-subtitle">
                            {isSubSuperAdmin
                                ? "Review admin activities, college activities, login history, and export scoped logs."
                                : "Search and filter platform activity by date, user, role, action, college, IP, and details."}
                        </p>
                    </div>
                    <button className="btn-secondary" type="button" onClick={exportCsv}>Export CSV</button>
                </div>

                <div className="exam-cards">
                    <div className="exam-card"><strong>Total Logs</strong><span>{pagination.total || logs.length}</span></div>
                    <div className="exam-card"><strong>Login History</strong><span>{filteredSummary.logins}</span></div>
                    <div className="exam-card"><strong>Admin Activities</strong><span>{filteredSummary.adminActivities}</span></div>
                    <div className="exam-card"><strong>College Activities</strong><span>{filteredSummary.collegeActivities}</span></div>
                </div>

                <div className="utility-panel">
                    <div className="filters form-grid-2">
                        <input name="search" placeholder="Search details, action, or IP" value={filters.search} onChange={handleFilterChange} />
                        <select name="action" value={filters.action} onChange={handleFilterChange}>
                            <option value="">All Actions</option>
                            {actions.map((action) => <option key={action} value={action}>{action}</option>)}
                        </select>
                        <select name="role" value={filters.role} onChange={handleFilterChange}>
                            <option value="">All Roles</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="sub_super_admin">Sub Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                        </select>
                        <div className="form-grid-2">
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                        </div>
                    </div>

                    <div className="college-list">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                    <th>College</th>
                                    <th>IP</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7">Loading logs...</td></tr>
                                ) : logs.length ? logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>{new Date(log.timestamp || log.createdAt).toLocaleString()}</td>
                                        <td>{log.admin?.name || log.user?.name || "N/A"}</td>
                                        <td>{log.admin?.role || log.user?.role || "N/A"}</td>
                                        <td><span className="action-badge">{log.action}</span></td>
                                        <td>{log.college?.name || "N/A"}</td>
                                        <td>{log.ipAddress || "N/A"}</td>
                                        <td>{log.description || JSON.stringify(log.metadata || {})}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7">No logs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</button>
                        <span>Page {pagination.page || filters.page} of {pagination.pages || 1}</span>
                        <button disabled={filters.page >= (pagination.pages || 1)} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

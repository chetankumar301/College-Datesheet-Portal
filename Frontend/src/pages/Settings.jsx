import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

const commonSections = {
    profile: {
        title: "Profile",
        rows: ["Name", "Username", "Email", "Role"],
    },
    security: {
        title: "Security",
        rows: ["Password policy", "Refresh token sessions", "First-login password enforcement", "Credential resend audit"],
    },
    smtp: {
        title: "SMTP Email",
        rows: ["Sender email", "Credential delivery", "Connection timeout", "Delivery failure handling"],
    },
    notifications: {
        title: "Notifications",
        rows: ["Email alerts", "In-app alerts", "Unread badge", "System reminders"],
    },
};

const roleSections = {
    super_admin: [
        commonSections.profile,
        commonSections.security,
        commonSections.smtp,
        { title: "Platform", rows: ["College onboarding", "Access lifecycle", "Audit retention", "Global route permissions"] },
        { title: "Subscription Pricing", rows: ["Basic plan", "Standard plan", "Per-student pricing", "Upgrade and downgrade rules"] },
        commonSections.notifications,
        { title: "System Information", rows: ["API status", "Frontend build", "Cloudinary storage", "JWT refresh flow"] },
    ],
    sub_super_admin: [
        commonSections.profile,
        commonSections.security,
        { title: "College Details", rows: ["Assigned college", "College admins", "Subscription status", "Approval scope"] },
        commonSections.smtp,
        commonSections.notifications,
        { title: "Admin Account Settings", rows: ["Create admins", "Deactivate admins", "Resend credentials", "College-only permissions"] },
    ],
    admin: [
        commonSections.profile,
        commonSections.security,
        { title: "Examination Preferences", rows: ["Default exam type", "Datesheet upload rules", "Parsing queue alerts", "Publish checklist"] },
        { title: "Notification Preferences", rows: ["Student broadcast defaults", "Complaint updates", "Schedule reminders", "Email copies"] },
        { title: "College Information", rows: ["College name", "Assigned courses", "Active semesters", "Support contacts"] },
    ],
};

export default function Settings() {
    const { user } = useAuth();
    const sections = roleSections[user?.role] || [commonSections.profile, commonSections.security];

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">Account</p>
                        <h1>Settings</h1>
                        <p className="page-subtitle">Role-based account, email, notification, and system configuration.</p>
                    </div>
                </div>

                <div className="utility-panel">
                    <div className="settings-grid">
                        {sections.map((section) => (
                            <div className="utility-card" key={section.title}>
                                <h2>{section.title}</h2>
                                <div className="analytics-list">
                                    {section.title === "Profile" ? (
                                        <>
                                            <div className="analytics-row"><span>Name</span><span>{user?.name || "N/A"}</span></div>
                                            <div className="analytics-row"><span>Username</span><span>{user?.username || "N/A"}</span></div>
                                            <div className="analytics-row"><span>Email</span><span>{user?.email || "N/A"}</span></div>
                                            <div className="analytics-row"><span>Role</span><span>{user?.role || "N/A"}</span></div>
                                        </>
                                    ) : section.title === "College Details" || section.title === "College Information" ? (
                                        <>
                                            <div className="analytics-row"><span>College</span><span>{user?.college?.name || user?.college || "N/A"}</span></div>
                                            {section.rows.slice(1).map((row) => <div className="analytics-row" key={row}><span>{row}</span><span>Configured</span></div>)}
                                        </>
                                    ) : (
                                        section.rows.map((row) => <div className="analytics-row" key={row}><span>{row}</span><span>Ready</span></div>)
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

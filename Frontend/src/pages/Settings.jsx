import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="utility-page">
                <div className="utility-header">
                    <div>
                        <p className="page-kicker">Account</p>
                        <h1>Settings</h1>
                        <p className="page-subtitle">Review your current account and access context.</p>
                    </div>
                </div>

                <div className="utility-panel">
                    <div className="settings-grid">
                        <div className="utility-card">
                            <h2>Profile</h2>
                            <p>Name: {user?.name || "N/A"}</p>
                            <p>Email: {user?.email || "N/A"}</p>
                            <p>Username: {user?.username || "N/A"}</p>
                        </div>
                        <div className="utility-card">
                            <h2>Access</h2>
                            <p>Role: {user?.role || "N/A"}</p>
                            <p>Status: {user?.isActive === false ? "Inactive" : "Active"}</p>
                            <p>College: {user?.college?.name || user?.college || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

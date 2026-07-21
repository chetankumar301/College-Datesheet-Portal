import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createNewPassword } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const getHomePath = (role) => {
    if (role === "super_admin") return "/super-admin/dashboard";
    if (role === "sub_super_admin") return "/sub-super-admin/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
};

export default function CreateNewPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Password and confirm password do not match");
            return;
        }

        try {
            setSaving(true);
            const res = await createNewPassword(newPassword, confirmPassword);
            login(res.token, res.user);
            toast.success("Password created successfully");
            navigate(getHomePath(res.user?.role), { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Create New Password</h1>
                <p className="login-help">
                    Signed in as {user?.username || user?.email}. Create a permanent password to continue.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

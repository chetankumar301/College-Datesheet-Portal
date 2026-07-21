import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createNewPassword } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function CreateNewPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setSaving(true);
            const res = await createNewPassword(newPassword);
            const token = res.token || localStorage.getItem("token");

            if (token && res.user) {
                login(token, res.user);
            }

            toast.success("Password created successfully");
            navigate("/sub-super-admin/dashboard", { replace: true });
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

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Create Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

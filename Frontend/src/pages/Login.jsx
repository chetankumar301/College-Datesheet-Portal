import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {

    const [studentId, setStudentId] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            console.log("Attempting login with:", studentId);
           const res = await loginUser(studentId, password);

            console.log("Login response:", res);
            console.log("User role:", res.user?.role);

            if (!res.user) {
                console.error("No user in response");
                toast.error("Login Failed: No user data received");
                return;
            }

            login(

                res.token,

                res.user

                );

                if (res.user.role === "super_admin") {

                console.log("Navigating to super admin dashboard");
                navigate("/super-admin/dashboard");

                    }
                else if (res.user.role === "sub_super_admin") {

                console.log("Navigating to sub super admin dashboard");
                navigate("/sub-super-admin/dashboard");

                    }
                else if (res.user.role === "admin") {

                console.log("Navigating to admin dashboard");
                navigate("/admin/dashboard");

                    }
                else {

                console.log("Navigating to student dashboard");
                    navigate("/student/dashboard");

                }

        }

        catch (err) {
            console.error("Login error:", err);
            console.error("Error response:", err.response?.data);
            toast.error(

                err.response?.data?.message ||

                "Login Failed"

            );

        }

    };

    return (

<div className="login-page">

    <div className="login-card">

        <h1>College Datesheet Portal</h1>

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Student ID / Admin Email"
                value={studentId}
                onChange={(e)=>setStudentId(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button type="submit">

                Login

            </button>

        </form>

    </div>

</div>

);

}
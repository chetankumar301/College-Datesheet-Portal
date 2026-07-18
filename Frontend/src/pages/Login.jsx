import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {

    const [identifier, setIdentifier] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
           const res = await loginUser(identifier, password);

            if (!res.user) {
                toast.error("Login Failed: No user data received");
                return;
            }

            login(

                res.token,

                res.user

                );

                if (res.user.role === "super_admin") {
                navigate("/super-admin/dashboard");

                    }
                else if (res.user.role === "sub_super_admin") {
                navigate("/sub-super-admin/dashboard");

                    }
                else if (res.user.role === "admin") {
                navigate("/admin/dashboard");

                    }
                else {
                    navigate("/student/dashboard");

                }

        }

        catch (err) {
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
                placeholder="Username or Email"
                value={identifier}
                onChange={(e)=>setIdentifier(e.target.value)}
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

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/" replace />;

    }

    if (user.role !== "admin" && user.role !== "super_admin") {

        return <Navigate to="/student/dashboard" replace />;

    }

    return children;

}
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/" replace />;

    }

    if (user.role !== "student") {

        return <Navigate to="/admin/dashboard" replace />;

    }

    return children;

}
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

export default function AdminRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {

        return <PageLoader />;

    }

    if (!user) {

        return <Navigate to="/" replace />;

    }

    if (user.mustChangePassword) {
        return <Navigate to="/create-new-password" replace />;
    }

    if (user.role !== "admin") {

        return <Navigate to={user.role === "super_admin" ? "/super-admin/dashboard" : "/student/dashboard"} replace />;

    }

    return children;

}

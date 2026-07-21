import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

export default function SubSuperAdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== "sub_super_admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.mustChangePassword) {
        return <Navigate to="/create-new-password" replace />;
    }

    return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

const getHomePath = (user) => {
    if (user.role === "super_admin") return "/super-admin/dashboard";
    if (user.role === "sub_super_admin") return "/sub-super-admin/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
};

const ProtectedRoute = ({ children, allowPasswordChange = false }) => {

    const { user, loading } = useAuth();

    if (loading) return <PageLoader />;

    if (!user) {

        return <Navigate to="/" replace />;

    }

    if (user.mustChangePassword && !allowPasswordChange) {

        return <Navigate to="/create-new-password" replace />;

    }

    if (!user.mustChangePassword && allowPasswordChange) {

        return <Navigate to={getHomePath(user)} replace />;

    }

    return children;

};

export default ProtectedRoute;

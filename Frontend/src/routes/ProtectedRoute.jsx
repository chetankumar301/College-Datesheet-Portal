import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

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
        return <Navigate to="/" replace />;
    }

    return children;

};

export default ProtectedRoute;

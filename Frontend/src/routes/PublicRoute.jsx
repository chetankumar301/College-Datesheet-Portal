import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {

    const { user } = useAuth();

    if (user) {
        if (user.role === "admin" || user.role === "super_admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/student/dashboard" replace />;
    }

    return children;

};

export default PublicRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

export default function StudentRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {

        return <PageLoader />;

    }

    if (!user) {

        return <Navigate to="/" replace />;

    }

    if (user.role !== "student") {

        return <Navigate to="/admin/dashboard" replace />;

    }

    return children;

}

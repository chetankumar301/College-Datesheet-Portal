import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

import PublicRoute from "./PublicRoute";
import UploadPDF from "../pages/UploadPDF";
import Preview from "../pages/Preview";
import StudentDashboard from "../pages/StudentDashboard";
import StudentDatesheet from "../pages/StudentDatesheet";
import StudentComplaints from "../pages/StudentComplaints";
import StudentNotifications from "../pages/StudentNotifications";
import StudentProfile from "../pages/StudentProfile";
import StudentBackDatesheet from "../pages/StudentBackDatesheet";
import AdminRoute from "./AdminRoute";
import StudentRoute from "./StudentRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import AdminManagement from "../pages/AdminManagement";

export default function AppRoutes(){

    return(

        <Routes>

            <Route

                path="/"

                element={

                    <PublicRoute>

                        <Login/>

                    </PublicRoute>

                }

            />

            <Route

            path="/admin/dashboard"

            element={

            <AdminRoute>

            <Dashboard/>

                </AdminRoute>

}

/>


                <Route

                path="/upload"

                element={

                <AdminRoute>

                <UploadPDF/>

                </AdminRoute>

                }

                />

                <Route

                path="/preview"

                element={

                <AdminRoute>

                <Preview/>

                </AdminRoute>

                }

                />

                <Route

                path="/super-admin/admin-management"

                element={

                <SuperAdminRoute>

                <AdminManagement/>

                </SuperAdminRoute>

                }

                />

<Route

path="/student/dashboard"

element={

<StudentRoute>

<StudentDashboard/>

</StudentRoute>

}

/>

<Route

path="/student/datesheet"

element={

<StudentRoute>

<StudentDatesheet/>

</StudentRoute>

}

/>

<Route

path="/student/complaints"

element={

<StudentRoute>

<StudentComplaints/>

</StudentRoute>

}

/>

<Route
path="/student/notifications"
element={
<StudentRoute>
<StudentNotifications />
</StudentRoute>
}
/>

<Route

path="/student/profile"

element={

<StudentRoute>

<StudentProfile/>

</StudentRoute>

}
/>

<Route
path="/student/back"
element={
<StudentRoute>
<StudentBackDatesheet />
</StudentRoute>
}
/>

        </Routes>

    );

}

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
import StudentPublishedDatesheets from "../pages/StudentPublishedDatesheets";
import AdminRoute from "./AdminRoute";
import StudentRoute from "./StudentRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import SubSuperAdminRoute from "./SubSuperAdminRoute";
import AdminManagement from "../pages/AdminManagement";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import CollegeManagement from "../pages/CollegeManagement";
import CollegeDetails from "../pages/CollegeDetails";
import SubscriptionManagement from "../pages/SubscriptionManagement";
import SubSuperAdminDashboard from "../pages/SubSuperAdminDashboard";
import DatesheetApproval from "../pages/DatesheetApproval";
import AuditLogViewer from "../pages/AuditLogViewer";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import ExaminationList from "../pages/ExaminationList";
import CreateExaminationWizard from "../pages/CreateExaminationWizard";
import ScheduleOptionsComparison from "../pages/ScheduleOptionsComparison";
import DatesheetCalendar from "../pages/DatesheetCalendar";
import ConflictPanel from "../pages/ConflictPanel";
import ExaminationDetail from "../pages/ExaminationDetail";
import Published from "../pages/Published";

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

                path="/super-admin/dashboard"

                element={

                <SuperAdminRoute>

                <SuperAdminDashboard/>

                </SuperAdminRoute>

                }

                />

                <Route

                path="/super-admin/colleges"

                element={

                <SuperAdminRoute>

                <CollegeManagement/>

                </SuperAdminRoute>

                }

                />

                <Route

                path="/super-admin/subscriptions"

                element={

                <SuperAdminRoute>

                <SubscriptionManagement/>

                </SuperAdminRoute>

                }

                />

                <Route

                path="/super-admin/analytics"

                element={

                <SuperAdminRoute>

                <AnalyticsDashboard/>

                </SuperAdminRoute>

                }

                />

                <Route

                path="/super-admin/audit-logs"

                element={

                <SuperAdminRoute>

                <AuditLogViewer/>

                </SuperAdminRoute>

                }

                />

                <Route
                path="/super-admin/colleges/:id"
                element={
                    <SuperAdminRoute>
                        <CollegeDetails/>
                    </SuperAdminRoute>
                }
                />

                <Route
                path="/exams"
                element={
                    <ProtectedRoute>
                        <ExaminationList/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/exams/create"
                element={
                    <ProtectedRoute>
                        <CreateExaminationWizard/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/exams/:id/compare"
                element={
                    <ProtectedRoute>
                        <ScheduleOptionsComparison/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/exams/calendar"
                element={
                    <ProtectedRoute>
                        <DatesheetCalendar/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/exams/:id/conflicts"
                element={
                    <ProtectedRoute>
                        <ConflictPanel/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/exams/:id"
                element={
                    <ProtectedRoute>
                        <ExaminationDetail/>
                    </ProtectedRoute>
                }
                />

                <Route
                path="/published"
                element={
                    <ProtectedRoute>
                        <Published/>
                    </ProtectedRoute>
                }
                />

                <Route

                path="/sub-super-admin/dashboard"

                element={

                <SubSuperAdminRoute>

                <SubSuperAdminDashboard/>

                </SubSuperAdminRoute>

                }

                />

                <Route

                path="/sub-super-admin/datesheet-approval"

                element={

                <SubSuperAdminRoute>

                <DatesheetApproval/>

                </SubSuperAdminRoute>

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

<Route
path="/student/published-datesheets"
element={
<StudentRoute>
<StudentPublishedDatesheets />
</StudentRoute>
}
/>

        </Routes>

    );

}

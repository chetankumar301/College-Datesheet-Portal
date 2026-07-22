
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";

import ProtectedRoute from "./ProtectedRoute";

import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import StudentRoute from "./StudentRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import SubSuperAdminRoute from "./SubSuperAdminRoute";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UploadPDF = lazy(() => import("../pages/UploadPDF"));
const Preview = lazy(() => import("../pages/Preview"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const StudentDatesheet = lazy(() => import("../pages/StudentDatesheet"));
const StudentComplaints = lazy(() => import("../pages/StudentComplaints"));
const StudentNotifications = lazy(() => import("../pages/StudentNotifications"));
const StudentProfile = lazy(() => import("../pages/StudentProfile"));
const StudentBackDatesheet = lazy(() => import("../pages/StudentBackDatesheet"));
const StudentPublishedDatesheets = lazy(() => import("../pages/StudentPublishedDatesheets"));
const AdminManagement = lazy(() => import("../pages/AdminManagement"));
const SuperAdminDashboard = lazy(() => import("../pages/SuperAdminDashboard"));
const CollegeManagement = lazy(() => import("../pages/CollegeManagement"));
const CollegeDetails = lazy(() => import("../pages/CollegeDetails"));
const SubscriptionManagement = lazy(() => import("../pages/SubscriptionManagement"));
const SubSuperAdminDashboard = lazy(() => import("../pages/SubSuperAdminDashboard"));
const DatesheetApproval = lazy(() => import("../pages/DatesheetApproval"));
const AuditLogViewer = lazy(() => import("../pages/AuditLogViewer"));
const AnalyticsDashboard = lazy(() => import("../pages/AnalyticsDashboard"));
const ExaminationList = lazy(() => import("../pages/ExaminationList"));
const CreateExaminationWizard = lazy(() => import("../pages/CreateExaminationWizard"));
const ScheduleOptionsComparison = lazy(() => import("../pages/ScheduleOptionsComparison"));
const DatesheetCalendar = lazy(() => import("../pages/DatesheetCalendar"));
const ConflictPanel = lazy(() => import("../pages/ConflictPanel"));
const ExaminationDetail = lazy(() => import("../pages/ExaminationDetail"));
const Published = lazy(() => import("../pages/Published"));
const Settings = lazy(() => import("../pages/Settings"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Subjects = lazy(() => import("../pages/Subjects"));
const Students = lazy(() => import("../pages/Students"));
const ParsingJobs = lazy(() => import("../pages/ParsingJobs"));
const CreateNewPassword = lazy(() => import("../pages/CreateNewPassword"));
const Complaints = lazy(() => import("../pages/Complaints"));

export default function AppRoutes(){

    return(

        <Suspense fallback={<PageLoader />}>

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
                path="/create-new-password"
                element={
                    <ProtectedRoute allowPasswordChange>
                        <CreateNewPassword/>
                    </ProtectedRoute>
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
                path="/parsing"
                element={
                    <AdminRoute>
                        <ParsingJobs/>
                    </AdminRoute>
                }
                />

                <Route
                path="/students"
                element={
                    <AdminRoute>
                        <Students/>
                    </AdminRoute>
                }
                />

                <Route
                path="/subjects"
                element={
                    <AdminRoute>
                        <Subjects/>
                    </AdminRoute>
                }
                />

                <Route
                path="/notifications"
                element={
                    <AdminRoute>
                        <Notifications/>
                    </AdminRoute>
                }
                />

                <Route
                path="/complaints"
                element={
                    <AdminRoute>
                        <Complaints/>
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
                path="/super-admin/sub-super-admin-management"
                element={
                <SuperAdminRoute>
                <AdminManagement/>
                </SuperAdminRoute>
                }
                />

                <Route
                path="/sub-super-admin/admin-management"
                element={
                    <SubSuperAdminRoute>
                        <AdminManagement/>
                    </SubSuperAdminRoute>
                }
                />

                <Route
                path="/sub-super-admin/audit-logs"
                element={
                    <SubSuperAdminRoute>
                        <AuditLogViewer/>
                    </SubSuperAdminRoute>
                }
                />

                <Route
                path="/sub-super-admin/reports"
                element={
                    <SubSuperAdminRoute>
                        <AnalyticsDashboard/>
                    </SubSuperAdminRoute>
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
                    <AdminRoute>
                        <ExaminationList/>
                    </AdminRoute>
                }
                />

                <Route
                path="/exams/create"
                element={
                    <AdminRoute>
                        <CreateExaminationWizard/>
                    </AdminRoute>
                }
                />

                <Route
                path="/exams/:id/compare"
                element={
                    <AdminRoute>
                        <ScheduleOptionsComparison/>
                    </AdminRoute>
                }
                />

                <Route
                path="/exams/calendar"
                element={
                    <AdminRoute>
                        <DatesheetCalendar/>
                    </AdminRoute>
                }
                />

                <Route
                path="/exams/:id/conflicts"
                element={
                    <AdminRoute>
                        <ConflictPanel/>
                    </AdminRoute>
                }
                />

                <Route
                path="/exams/:id"
                element={
                    <AdminRoute>
                        <ExaminationDetail/>
                    </AdminRoute>
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
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings/>
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

        </Suspense>

    );

}

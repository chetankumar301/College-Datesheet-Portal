import {
    FaHome,
    FaFilePdf,
    FaTasks,
    FaCalendarAlt,
    FaUserGraduate,
    FaBook,
    FaBell,
    FaExclamationTriangle,
    FaCog,
    FaSignOutAlt,
    FaClipboardList
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "../../styles/sidebar.css";

export default function Sidebar({ isOpen = false, onClose }) {

    const { user, loading } = useAuth();

    if (loading) {
        return <div className={`sidebar ${isOpen ? "is-open" : ""}`}>Loading...</div>;
    }

    const menus = [

        {
            name:"Dashboard",
            path: user?.role === "super_admin" ? "/super-admin/dashboard" : user?.role === "sub_super_admin" ? "/sub-super-admin/dashboard" : "/admin/dashboard",
            icon:<FaHome/>
        },

        ...(user?.role === "super_admin" ? [
            {
                name:"Colleges",
                path:"/super-admin/colleges",
                icon:<FaUserGraduate/>
            },
            {
                name:"Subscriptions",
                path:"/super-admin/subscriptions",
                icon:<FaCalendarAlt/>
            },
            {
                name:"Sub Super Admins",
                path:"/super-admin/sub-super-admin-management",
                icon:<FaCog/>
            },
            {
                name:"Analytics",
                path:"/super-admin/analytics",
                icon:<FaTasks/>
            },
            {
                name:"Audit Logs",
                path:"/super-admin/audit-logs",
                icon:<FaExclamationTriangle/>
            },
        ] : []),

        ...(user?.role === "sub_super_admin" ? [
            {
                name:"Datesheet Approval",
                path:"/sub-super-admin/datesheet-approval",
                icon:<FaCalendarAlt/>
            },
            {
                name:"Admin Management",
                path:"/sub-super-admin/admin-management",
                icon:<FaCog/>
            },
            {
                name:"Audit Logs",
                path:"/sub-super-admin/audit-logs",
                icon:<FaExclamationTriangle/>
            },
            {
                name:"Reports",
                path:"/sub-super-admin/reports",
                icon:<FaTasks/>
            },
        ] : []),

        ...(user?.role === "admin" ? [
            {
                name:"Upload PDF",
                path:"/upload",
                icon:<FaFilePdf/>
            },
            {
                name:"Parsing Jobs",
                path:"/parsing",
                icon:<FaTasks/>
            },
            {
                name:"Published",
                path:"/published",
                icon:<FaCalendarAlt/>
            },
            {
                name:"Students",
                path:"/students",
                icon:<FaUserGraduate/>
            },
            {
                name:"Subjects",
                path:"/subjects",
                icon:<FaBook/>
            },
            {
                name:"Complaints",
                path:"/complaints",
                icon:<FaExclamationTriangle/>
            },
            {
                name:"Notifications",
                path:"/notifications",
                icon:<FaBell/>
            },
            {
                name:"Examinations",
                path:"/exams",
                icon:<FaClipboardList/>
            },
        ] : []),

        {
            name:"Settings",
            path:"/settings",
            icon:<FaCog/>
        }

    ];

    return(

        <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>

            <h2>

                Datesheet Portal

            </h2>

            {

                menus.map(menu=>(

                    <NavLink

                        key={menu.name}

                        to={menu.path}

                        onClick={onClose}

                    >

                        {menu.icon}

                        {menu.name}

                    </NavLink>

                ))

            }

        </aside>

    );

}

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
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "../../styles/sidebar.css";

export default function Sidebar() {

    const { user } = useAuth();

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
                name:"Admin Management",
                path:"/super-admin/admin-management",
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
                path:"/super-admin/admin-management",
                icon:<FaCog/>
            },
            {
                name:"Audit Logs",
                path:"/super-admin/audit-logs",
                icon:<FaExclamationTriangle/>
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
        ] : []),

        {
            name:"Settings",
            path:"/settings",
            icon:<FaCog/>
        }

    ];

    return(

        <div className="sidebar">

            <h2>

                Datesheet Portal

            </h2>

            {

                menus.map(menu=>(

                    <NavLink

                        key={menu.name}

                        to={menu.path}

                    >

                        {menu.icon}

                        {menu.name}

                    </NavLink>

                ))

            }

        </div>

    );

}
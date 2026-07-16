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
            path:"/admin/dashboard",
            icon:<FaHome/>
        },

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

        ...(user?.role === "super_admin" ? [{
            name:"Admin Management",
            path:"/super-admin/admin-management",
            icon:<FaCog/>
        }] : []),

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
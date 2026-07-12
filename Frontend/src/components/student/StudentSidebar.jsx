import {

FaHome,

FaCalendarAlt,

FaBook,

FaBell,

FaExclamationTriangle,

FaUser,

FaSignOutAlt

} from "react-icons/fa";

import {

NavLink

} from "react-router-dom";

export default function StudentSidebar(){

return(

<div className="sidebar">

<h2>

Student Portal

</h2>

<NavLink to="/student/dashboard">

<FaHome/>

Dashboard

</NavLink>

<NavLink to="/student/datesheet">

<FaCalendarAlt/>

Current Datesheet

</NavLink>

<NavLink to="/student/back">

<FaBook/>

Back Datesheets

</NavLink>

<NavLink to="/student/complaints">

<FaExclamationTriangle/>

Complaints

</NavLink>

<NavLink to="/student/notifications">

<FaBell/>

Notifications

</NavLink>

<NavLink to="/student/profile">

<FaUser/>

Profile

</NavLink>

<NavLink to="/">

<FaSignOutAlt/>

Logout

</NavLink>

</div>

);

}
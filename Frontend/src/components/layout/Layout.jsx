import Sidebar from "./Sidebar";

import Header from "./Header";

import { useState } from "react";

export default function Layout({

children

}){

const [sidebarOpen, setSidebarOpen] = useState(false);

return(

<div className={`layout ${sidebarOpen ? "sidebar-open" : ""}`}>

<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

{sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />}

<div className="content">

<Header onMenuClick={() => setSidebarOpen(true)}/>

<div className="page">

{children}

</div>

</div>

</div>

);

}

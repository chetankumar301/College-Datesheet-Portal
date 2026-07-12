import Sidebar from "./Sidebar";

import Header from "./Header";

export default function Layout({

children

}){

return(

<div className="layout">

<Sidebar/>

<div className="content">

<Header/>

<div className="page">

{children}

</div>

</div>

</div>

);

}
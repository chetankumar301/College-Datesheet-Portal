import { useEffect,useState } from "react";

import Layout from "../components/layout/Layout";

import NotificationList from "../components/student/NotificationList";

import ClashAlert from "../components/student/ClashAlert";

import {

getNotifications,

markAsRead,

getClashes

}

from "../services/notificationService";

export default function StudentNotifications(){

const[notifications,setNotifications]=useState([]);

const[clashes,setClashes]=useState([]);

useEffect(()=>{

load();

},[]);

const load=async()=>{

const notify=await getNotifications();

setNotifications(

notify.data

);

const clash=await getClashes();

setClashes(

clash.data

);

};

const read=async(id)=>{

await markAsRead(id);

load();

};

const raiseComplaint=(clash)=>{

console.log(clash);

};

return(

<Layout>

<ClashAlert

clashes={clashes}

onRaiseComplaint={raiseComplaint}

/>

<h1>

Notifications

</h1>

<NotificationList

notifications={notifications}

onRead={read}

/>

</Layout>

);

}
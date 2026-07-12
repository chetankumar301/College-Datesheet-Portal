export default function NotificationCard({

notification,

onRead

}){

return(

<div className="notification-card">

<h3>

{

notification.title

}

</h3>

<p>

{

notification.message

}

</p>

<small>

{

new Date(

notification.createdAt

).toLocaleString()

}

</small>

{

!notification.isRead&&

<button

onClick={()=>onRead(notification._id)}

>

Mark Read

</button>

}

</div>

);

}
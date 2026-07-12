import NotificationCard from "./NotificationCard";

export default function NotificationList({

notifications,

onRead

}){

return(

<div>

{

notifications.map(notification=>

<NotificationCard

key={notification._id}

notification={notification}

onRead={onRead}

/>

)

}

</div>

);

}
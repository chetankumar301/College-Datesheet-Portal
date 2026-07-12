export default function ComplaintCard({

complaint

}){

return(

<div className="complaint-card">

<h3>

{

complaint.complaintType

}

</h3>

<p>

Status :

<b>

{

complaint.status

}

</b>

</p>

<p>

{

complaint.description

}

</p>

{

complaint.adminReply&&

<div>

<hr/>

<b>

Admin Reply

</b>

<p>

{

complaint.adminReply

}

</p>

</div>

}

</div>

);

}
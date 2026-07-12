import ComplaintCard from "./ComplaintCard";

export default function ComplaintHistory({

complaints

}){

return(

<div>

<h2>

Complaint History

</h2>

{

complaints.map(c=>

<ComplaintCard

key={c._id}

complaint={c}

/>

)

}

</div>

);

}
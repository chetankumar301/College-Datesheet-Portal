import { useAuth } from "../../context/AuthContext";

export default function ProfileCard(){

const{

user

}=useAuth();

return(

<div className="profile-card">

<h2>

Student Profile

</h2>

<p>

<b>Name:</b>

{user.name}

</p>

<p>

<b>Email:</b>

{user.email}

</p>

<p>

<b>Course:</b>

{user.course}

</p>

<p>

<b>Branch:</b>

{user.branch}

</p>

<p>

<b>Semester:</b>

{user.semester}

</p>

<p>

<b>Year:</b>

{user.year}

</p>

</div>

);

}
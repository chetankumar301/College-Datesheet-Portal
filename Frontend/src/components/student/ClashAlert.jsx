export default function ClashAlert({

clashes,

onRaiseComplaint

}){

if(clashes.length===0){

return null;

}

return(

<div className="clash-alert">

<h2>

⚠ Exam Clash Detected

</h2>

{

clashes.map((clash,index)=>

<div key={index}>

<h3>

{

clash.subject1.subjectName

}

</h3>

↓

<h3>

{

clash.subject2.subjectName

}

</h3>

<button

onClick={()=>

onRaiseComplaint(clash)

}

>

Raise Complaint

</button>

</div>

)

}

</div>

);

}
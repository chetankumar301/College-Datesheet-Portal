import { useState } from "react";

export default function ComplaintForm({

subjects,

onSubmit

}){

const[data,setData]=useState({

subject1:"",

subject2:"",

complaintType:"EXAM_CLASH",

description:"",

file:null

});

const handleSubmit=(e)=>{

e.preventDefault();

const form=new FormData();

form.append("subject1",data.subject1);

form.append("subject2",data.subject2);

form.append("complaintType",data.complaintType);

form.append("description",data.description);

if(data.file){

form.append("file",data.file);

}

onSubmit(form);

};

return(

<form onSubmit={handleSubmit}>

<h2>

Raise Complaint

</h2>

<select

onChange={(e)=>

setData({

...data,

subject1:e.target.value

})

}

>

<option>

Select Subject 1

</option>

{

subjects.map(subject=>

<option

key={subject._id}

value={subject._id}

>

{subject.subjectName}

</option>

)

}

</select>

<select

onChange={(e)=>

setData({

...data,

subject2:e.target.value

})

}

>

<option>

Select Subject 2

</option>

{

subjects.map(subject=>

<option

key={subject._id}

value={subject._id}

>

{subject.subjectName}

</option>

)

}

</select>

<textarea

placeholder="Describe Problem"

onChange={(e)=>

setData({

...data,

description:e.target.value

})

}

/>

<input

type="file"

accept="image/*,.pdf"

onChange={(e)=>

setData({

...data,

file:e.target.files[0]

})

}

/>

<button>

Submit Complaint

</button>

</form>

);

}
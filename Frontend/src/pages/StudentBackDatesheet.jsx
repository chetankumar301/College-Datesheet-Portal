import Layout from "../components/layout/Layout";

import BackDatesheetCard from "../components/student/BackDatesheetCard";

export default function StudentBackDatesheet(){

const semesters=[1,2,3,4,5,6,7,8];

return(

<Layout>

<h1>

Back Examination Datesheets

</h1>

<div className="student-grid">

{

semesters.map(semester=>

<BackDatesheetCard

key={semester}

semester={semester}

onClick={()=>{

console.log(

semester

);

}}

 />

)

}

</div>

</Layout>

);

}
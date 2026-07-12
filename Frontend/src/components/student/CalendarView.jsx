export default function CalendarView({

exams

}){

return(

<div className="calendar">

{

exams.map(exam=>

<div

key={exam._id}

className="calendar-item"

>

<h3>

{exam.examDate}

</h3>

<p>

{

exam.subject.subjectName

}

</p>

</div>

)

}

</div>

);

}
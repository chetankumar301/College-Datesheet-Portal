export default function BackDatesheetCard({

semester,

onClick

}){

return(

<div

className="back-card"

onClick={onClick}

>

<h2>

Semester {semester}

</h2>

<p>

View Back Datesheet

</p>

</div>

);

}
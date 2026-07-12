export default function ProgressBar({

progress

}){

return(

<div className="progress-container">

<div

className="progress"

style={{

width:`${progress}%`

}}

>

{progress}%

</div>

</div>

);

}
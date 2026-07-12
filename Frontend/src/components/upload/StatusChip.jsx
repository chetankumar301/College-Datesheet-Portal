export default function StatusChip({

status

}){

const colors={

UPLOADED:"#2563eb",

PROCESSING:"#f59e0b",

PREVIEW:"#9333ea",

READY_FOR_REVIEW:"#16a34a",

PUBLISHED:"#059669",

FAILED:"#dc2626"

};

return(

<div

className="status-chip"

style={{

background:colors[status]

}}

>

{status}

</div>

);

}
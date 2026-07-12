export default function StatusBadge({

status

}){

const colors={

READY:"#16a34a",

PENDING:"#eab308",

FAILED:"#dc2626",

PROCESSING:"#2563eb",

PUBLISHED:"#9333ea",

RESOLVED:"#16a34a"

};

return(

<span

className="status-badge"

style={{

background:colors[status]||"#999"

}}

>

{status}

</span>

);

}
import StatusChip from "./StatusChip";

export default function HistoryTable({

uploads

}){

return(

<table className="history-table">

<thead>

<tr>

<th>

PDF

</th>

<th>

Status

</th>

<th>

Action

</th>

</tr>

</thead>

<tbody>

{

uploads.map(upload=>(

<tr key={upload._id}>

<td>

{upload.originalName}

</td>

<td>

<StatusChip

status={upload.status}

/>

</td>

<td>

<button>

View

</button>

</td>

</tr>

))

}

</tbody>

</table>

);

}
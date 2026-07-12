export default function UploadHistory({

uploads

}){

return(

<div className="history">

<h2>

Upload History

</h2>

<table>

<thead>

<tr>

<th>

PDF

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

{

uploads.map(upload=>(

<tr key={upload._id}>

<td>

{

upload.originalName

}

</td>

<td>

{

upload.status

}

</td>

</tr>

))

}

</tbody>

</table>

</div>

);

}
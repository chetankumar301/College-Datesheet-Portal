export default function UploadCard({

file,

onUpload,

onRemove

}){

return(

<div className="upload-card">

<h3>

{file.name}

</h3>

<p>

{

(file.size/1024/1024)

.toFixed(2)

}

MB

</p>

<button

onClick={onUpload}

>

Upload

</button>

<button

onClick={onRemove}

>

Remove

</button>

</div>

);

}
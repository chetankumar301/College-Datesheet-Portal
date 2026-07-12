export default function PDFInfoCard({

file

}){

if(!file)return null;

return(

<div className="pdf-card">

<h2>

Selected PDF

</h2>

<p>

Name :

{file.name}

</p>

<p>

Size :

{

(file.size/1024/1024)

.toFixed(2)

}

MB

</p>

<p>

Type :

{file.type}

</p>

</div>

);

}
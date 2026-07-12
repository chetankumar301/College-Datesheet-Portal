import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import UploadCard from "../components/upload/UploadCard";

import UploadHistory from "../components/upload/UploadHistory";

import ProgressBar from "../components/upload/ProgressBar";

import {

uploadPDF,

getUploads

}

from "../services/pdfService";

export default function UploadPDF(){

const[file,setFile]=useState(null);

const[progress,setProgress]=useState(0);

const[uploads,setUploads]=useState([]);

useEffect(()=>{

loadUploads();

},[]);

const loadUploads=async()=>{

const res=await getUploads();

setUploads(

res.data

);

};

const handleUpload=async()=>{

const formData=new FormData();

formData.append(

"pdf",

file

);

await uploadPDF(

formData,

event=>{

setProgress(

Math.round(

(event.loaded*100)/event.total

)

);

}

);

setProgress(0);

setFile(null);

loadUploads();

};

return(

<Layout>

<h1>

Upload Datesheet PDF

</h1>

<input

type="file"

accept=".pdf"

onChange={(e)=>

setFile(

e.target.files[0]

)

}

/>

{

file&&

<UploadCard

file={file}

onUpload={handleUpload}

onRemove={()=>setFile(null)}

/>

}

{

progress>0&&

<ProgressBar

progress={progress}

/>

}

<UploadHistory

uploads={uploads}

/>

</Layout>

);

}
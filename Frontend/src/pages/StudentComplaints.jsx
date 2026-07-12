import { useEffect,useState } from "react";

import Layout from "../components/layout/Layout";

import ComplaintForm from "../components/student/ComplaintForm";

import ComplaintHistory from "../components/student/ComplaintHistory";

import {

createComplaint,

getMyComplaints

}

from "../services/complaintService";

import api from "../services/api";

export default function StudentComplaints(){

const[subjects,setSubjects]=useState([]);

const[complaints,setComplaints]=useState([]);

useEffect(()=>{

loadData();

},[]);

const loadData=async()=>{

const subjectRes=await api.get(

"/subjects"

);

setSubjects(

subjectRes.data.data

);

const complaintRes=await getMyComplaints();

setComplaints(

complaintRes.data.data

);

};

const submitComplaint=async(form)=>{

await createComplaint(form);

alert("Complaint Submitted");

loadData();

};

return(

<Layout>

<ComplaintForm

subjects={subjects}

onSubmit={submitComplaint}

/>

<hr/>

<ComplaintHistory

complaints={complaints}

/>

</Layout>

);

}
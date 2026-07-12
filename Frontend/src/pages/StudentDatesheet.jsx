import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import DatesheetToolbar from "../components/student/DatesheetToolbar";

import DatesheetTable from "../components/student/DatesheetTable";

import {

    getCurrentDatesheet,

    downloadCurrentDatesheet

}

from "../services/studentDatesheetService";

export default function StudentDatesheet() {

    const [exams, setExams] = useState([]);

    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    useEffect(() => {

        loadDatesheet();

    }, []);

    useEffect(() => {

        filterData();

    }, [search, status, exams]);

    const loadDatesheet = async () => {

        const res = await getCurrentDatesheet();

        setExams(res.data);

        setFiltered(res.data);

    };

    const filterData = () => {

        let data = [...exams];

        if (search) {

            data = data.filter(e =>

                e.subject.subjectName

                    .toLowerCase()

                    .includes(search.toLowerCase())

            );

        }

        if (status) {

            data = data.filter(

                e => e.status === status

            );

        }

        setFiltered(data);

    };

    const handleDownload = async () => {

        const response = await downloadCurrentDatesheet();

        const url = window.URL.createObjectURL(

            new Blob([response.data])

        );

        const link = document.createElement("a");

        link.href = url;

        link.download = "CurrentDatesheet.pdf";

        link.click();

    };

    const handlePrint = () => {

        window.print();

    };

    return (

        <Layout>

            <h1>

                Current Semester Datesheet

            </h1>

            <DatesheetToolbar

                search={search}

                setSearch={setSearch}

                status={status}

                setStatus={setStatus}

                onDownload={handleDownload}

                onPrint={handlePrint}

            />

            <DatesheetTable

                exams={filtered}

            />

        </Layout>

    );

}
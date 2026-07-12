import React from "react";
import Layout from "../components/layout/Layout";
import PreviewTable from "../components/preview/PreviewTable";
import PublishButton from "../components/preview/PublishButton";

function Preview() {
    return (
        <Layout>
            <div className="preview-page">
                <h1>Preview Exam Schedule</h1>
                <PreviewTable />
                <PublishButton />
            </div>
        </Layout>
    );
}

export default Preview;
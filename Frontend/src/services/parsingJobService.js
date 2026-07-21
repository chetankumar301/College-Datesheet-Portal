import api from "./api";

export const getParsingJobs = async () => {
    const response = await api.get("/parsing-job");
    return response.data;
};

export const getPreview = async (jobId) => {
    const response = await api.get(`/parsing-job/${jobId}`);
    return response.data;
};

export const updateRow = async (jobId, rowIndex, row) => {
    const response = await api.put(`/parsing-job/${jobId}`, { rowIndex, row });
    return response.data;
};

export const publishJob = async (jobId) => {
    const response = await api.post(`/parsing-job/publish/${jobId}`);
    return response.data;
};

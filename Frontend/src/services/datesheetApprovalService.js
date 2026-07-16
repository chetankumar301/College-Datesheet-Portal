import api from "./api";

export const submitForApproval = async (id) => {
    const response = await api.post(`/datesheet-approval/datesheets/${id}/submit`);
    return response.data;
};

export const approveDatesheet = async (id) => {
    const response = await api.post(`/datesheet-approval/datesheets/${id}/approve`);
    return response.data;
};

export const rejectDatesheet = async (id, reason) => {
    const response = await api.post(`/datesheet-approval/datesheets/${id}/reject`, { reason });
    return response.data;
};

export const publishDatesheet = async (id) => {
    const response = await api.post(`/datesheet-approval/datesheets/${id}/publish`);
    return response.data;
};

export const getPendingDatesheets = async (collegeId) => {
    const response = await api.get(`/datesheet-approval/datesheets/pending/${collegeId}`);
    return response.data;
};

export const getApprovedDatesheets = async (collegeId) => {
    const response = await api.get(`/datesheet-approval/datesheets/approved/${collegeId}`);
    return response.data;
};

export const getRejectedDatesheets = async (collegeId) => {
    const response = await api.get(`/datesheet-approval/datesheets/rejected/${collegeId}`);
    return response.data;
};

export const getPublishedDatesheets = async (collegeId, params) => {
    const response = await api.get(`/datesheet-approval/datesheets/published/${collegeId}`, { params });
    return response.data;
};

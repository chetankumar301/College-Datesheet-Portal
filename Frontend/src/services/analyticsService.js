import api from "./api";

export const getPlatformAnalytics = async () => {
    const res = await api.get("/analytics/platform");
    return res.data;
};

export const getCollegeAnalytics = async (collegeId) => {
    const res = await api.get(`/analytics/college/${collegeId}`);
    return res.data;
};

export const getAllCollegesAnalytics = async () => {
    const res = await api.get("/analytics/colleges");
    return res.data;
};

export const getAdminActivity = async (collegeId, params) => {
    const res = await api.get(`/analytics/admin-activity/${collegeId}`, {
        params,
    });
    return res.data;
};

export const getRevenueAnalytics = async () => {
    const res = await api.get("/analytics/revenue");
    return res.data;
};

export const getStudentAnalytics = async () => {
    const res = await api.get("/analytics/students");
    return res.data;
};
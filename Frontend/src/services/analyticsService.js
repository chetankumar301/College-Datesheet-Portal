import api from "./api";

export const getPlatformAnalytics = async () => {
    const response = await api.get("/analytics/analytics/platform");
    return response.data;
};

export const getCollegeAnalytics = async (collegeId) => {
    const response = await api.get(`/analytics/analytics/college/${collegeId}`);
    return response.data;
};

export const getAdminActivity = async (collegeId, params) => {
    const response = await api.get(`/analytics/analytics/admin-activity/${collegeId}`, { params });
    return response.data;
};

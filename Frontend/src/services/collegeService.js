import api from "./api";

export const getAllColleges = async () => {
    const response = await api.get("/colleges/colleges");
    return response.data;
};

export const getCollege = async (id) => {
    const response = await api.get(`/colleges/colleges/${id}`);
    return response.data;
};

export const getCollegeDetails = async (id) => {
    const response = await api.get(`/colleges/colleges/${id}/details`);
    return response.data;
};

export const createCollege = async (collegeData) => {
    const response = await api.post("/colleges/colleges", collegeData);
    return response.data;
};

export const updateCollege = async (id, collegeData) => {
    const response = await api.put(`/colleges/colleges/${id}`, collegeData);
    return response.data;
};

export const suspendCollege = async (id, reason) => {
    const response = await api.post(`/colleges/colleges/${id}/suspend`, { reason });
    return response.data;
};

export const activateCollege = async (id) => {
    const response = await api.post(`/colleges/colleges/${id}/activate`);
    return response.data;
};

export const deleteCollege = async (id) => {
    const response = await api.delete(`/colleges/colleges/${id}`);
    return response.data;
};

export const getCollegeStats = async () => {
    const response = await api.get("/colleges/colleges/stats");
    return response.data;
};

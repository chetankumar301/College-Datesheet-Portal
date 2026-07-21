import api from "./api";

export const getSubjects = async (params = {}) => {
    const response = await api.get("/subject", { params });
    return response.data;
};

export const createSubject = async (subjectData) => {
    const response = await api.post("/subject", subjectData);
    return response.data;
};

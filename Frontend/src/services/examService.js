import api from "./api";

export const getExaminations = async () => {
    const response = await api.get("/exams/examinations");
    return response.data;
};

export const getPublishedExaminations = async (params = {}) => {
    const response = await api.get("/exams/examinations/published", { params });
    return response.data;
};

export const getStudentPublishedExaminations = async (params = {}) => {
    const response = await api.get("/exams/examinations/student/published", { params });
    return response.data;
};

export const getPublishedExaminationPdfUrl = (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `http://localhost:5000/api/exams/examinations/${id}/pdf${query ? `?${query}` : ""}`;
};

export const getExaminationHistory = async (id) => {
    const response = await api.get(`/exams/examinations/${id}/history`);
    return response.data;
};

export const getScheduleVersions = async (id) => {
    const response = await api.get(`/exams/examinations/${id}/versions`);
    return response.data;
};

export const getScheduleSlots = async (id) => {
    const response = await api.get(`/exams/examinations/${id}/slots`);
    return response.data;
};

export const moveScheduleSlot = async (id, slotId, payload) => {
    const response = await api.put(`/exams/examinations/${id}/slots/${slotId}`, payload);
    return response.data;
};

export const getAcademicScope = async () => {
    const response = await api.get("/exams/examinations/scope");
    return response.data;
};

export const getEligibleSubjects = async (params = {}) => {
    const response = await api.get("/exams/examinations/eligible-subjects", { params });
    return response.data;
};

export const createExamination = async (payload) => {
    const response = await api.post("/exams/examinations", payload);
    return response.data;
};

export const updateExamination = async (id, payload) => {
    const response = await api.put(`/exams/examinations/${id}`, payload);
    return response.data;
};

export const calculateDifficulty = async (payload) => {
    const response = await api.post("/exams/examinations/difficulty", payload);
    return response.data;
};

export const generateExaminationSchedule = async (id) => {
    const response = await api.post(`/exams/examinations/${id}/generate`);
    return response.data;
};

export const compareScheduleOptions = async (id) => {
    const response = await api.get(`/exams/examinations/${id}/compare`);
    return response.data;
};

export const validateGeneratedSchedule = async (id) => {
    const response = await api.get(`/exams/examinations/${id}/validate`);
    return response.data;
};

export const submitExaminationForReview = async (id, payload = {}) => {
    const response = await api.post(`/exams/examinations/${id}/submit`, payload);
    return response.data;
};

export const requestExaminationChanges = async (id, payload = {}) => {
    const response = await api.post(`/exams/examinations/${id}/request-changes`, payload);
    return response.data;
};

export const approveExamination = async (id, payload = {}) => {
    const response = await api.post(`/exams/examinations/${id}/approve`, payload);
    return response.data;
};

export const publishExamination = async (id, payload = {}) => {
    const response = await api.post(`/exams/examinations/${id}/publish`, payload);
    return response.data;
};

export const getScheduleReview = async (id) => {
    const [comparison, validation] = await Promise.all([
        compareScheduleOptions(id),
        validateGeneratedSchedule(id),
    ]);

    return {
        comparison: comparison.data,
        validation: validation.data,
    };
};

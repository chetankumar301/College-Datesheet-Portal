import api from "./api";

export const getAllAuditLogs = async (params) => {
    const response = await api.get("/audit-logs/audit-logs", { params });
    return response.data;
};

export const getAuditLogsByEntity = async (entityType, entityId, params) => {
    const response = await api.get(`/audit-logs/audit-logs/entity/${entityType}/${entityId}`, { params });
    return response.data;
};

export const getAuditLogsByUser = async (userId, params) => {
    const response = await api.get(`/audit-logs/audit-logs/user/${userId}`, { params });
    return response.data;
};

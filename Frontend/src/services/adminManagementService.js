import api from "./api";

export const getAllAdmins = async () => {
    const response = await api.get("/super-admin/admins");
    return response.data;
};

export const getAllSubSuperAdmins = async () => {
    const response = await api.get("/super-admin/sub-super-admins");
    return response.data;
};

export const getCollegeAdmins = async (collegeId) => {
    const id = collegeId?._id || collegeId;
    const response = await api.get(id ? `/super-admin/college/${id}/admins` : "/super-admin/my-college/admins");
    return response.data;
};

export const createAdmin = async (adminData) => {
    const response = await api.post("/super-admin/admins", adminData);
    return response.data;
};

export const createCollegeAdmin = async (adminData) => {
    const response = await api.post("/super-admin/my-college/admins", adminData);
    return response.data;
};

export const updateAdmin = async (id, adminData) => {
    const response = await api.put(`/super-admin/admins/${id}`, adminData);
    return response.data;
};

export const deleteAdmin = async (id) => {
    const response = await api.delete(`/super-admin/admins/${id}`);
    return response.data;
};

export const resendAdminCredentials = async (id) => {
    const response = await api.post(`/super-admin/admins/${id}/resend-credentials`);
    return response.data;
};

export const getCollegeOwners = async (collegeId) => {
    const response = await api.get(`/super-admin/college/${collegeId}/owners`);
    return response.data;
};

export const createCollegeOwner = async (ownerData) => {
    const response = await api.post("/super-admin/admins", {
        name: ownerData.name,
        username: ownerData.username,
        email: ownerData.email,
        collegeId: ownerData.collegeId,
        role: "sub_super_admin",
    });
    return response.data;
};

export const updateCollegeOwner = async (id, ownerData) => {
    const response = await api.put(`/super-admin/admins/${id}`, ownerData);
    return response.data;
};

export const toggleCollegeOwnerStatus = async (id, isActive) => {
    const response = await api.put(`/super-admin/admins/${id}`, { isActive });
    return response.data;
};

export const toggleAdminStatus = toggleCollegeOwnerStatus;

export const resetCollegeOwnerPassword = async (id, password) => {
    const response = await api.put(`/super-admin/admins/${id}`, { password });
    return response.data;
};

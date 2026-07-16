import api from "./api";

export const getAllAdmins = async () => {
    const response = await api.get("/super-admin/admins");
    return response.data;
};

export const createAdmin = async (adminData) => {
    const response = await api.post("/super-admin/admins", adminData);
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

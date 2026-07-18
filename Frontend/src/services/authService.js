import api from "./api";

export const loginUser = async (identifier, password) => {
    try {
        const response = await api.post("/auth/login", {
            identifier,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async () => {

    const response = await api.get("/auth/profile");

    return response.data;

};

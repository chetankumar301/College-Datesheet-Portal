import api from "./api";

export const loginUser = async (studentId, password) => {
    console.log("loginService called with:", studentId);
    try {
        const response = await api.post("/auth/login", {
            studentId,
            password
        });
        console.log("loginService response:", response.data);
        return response.data;
    } catch (error) {
        console.error("loginService error:", error);
        throw error;
    }
};

export const getProfile = async () => {

    const response = await api.get("/auth/profile");

    return response.data;

};
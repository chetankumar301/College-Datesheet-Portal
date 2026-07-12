import api from "./api";

export const loginUser = async (studentId, password) => {

    const response = await api.post("/auth/login", {

        studentId,

        password

    });

    return response.data;

};

export const getProfile = async () => {

    const response = await api.get("/auth/profile");

    return response.data;

};
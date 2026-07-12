import api from "./api";

export const getDashboard = async () => {

    const response = await api.get("/dashboard");

    return response.data;

};

export const getCurrentDatesheet = async () => {

    const response = await api.get("/datesheet/current");

    return response.data;

};

export const getBackDatesheets = async () => {

    const response = await api.get("/datesheet/back");

    return response.data;

};

export const getClashes = async () => {

    const response = await api.get("/clashes");

    return response.data;

};
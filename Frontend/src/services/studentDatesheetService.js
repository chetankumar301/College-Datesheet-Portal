import api from "./api";

export const getCurrentDatesheet = async () => {

    const response = await api.get("/datesheet/current");

    return response.data;

};

export const downloadCurrentDatesheet = async () => {

    const response = await api.get(

        "/datesheet/current/download",

        {

            responseType: "blob"

        }

    );

    return response;

};
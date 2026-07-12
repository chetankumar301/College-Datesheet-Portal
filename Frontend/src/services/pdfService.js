import api from "./api";

export const uploadPDF = async (formData, onUploadProgress) => {

    const response = await api.post(

        "/pdf/upload",

        formData,

        {

            headers:{

                "Content-Type":"multipart/form-data"

            },

            onUploadProgress

        }

    );

    return response.data;

};

export const getUploads = async () => {

    const response = await api.get("/pdf");

    return response.data;

};

export const getParsingStatus = async (id) => {

    const response = await api.get(

        `/pdf/status/${id}`

    );

    return response.data;

};
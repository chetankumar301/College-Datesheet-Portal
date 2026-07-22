import api from "./api";

export const createComplaint = async (formData) => {

    const response = await api.post(

        "/complaints",

        formData,

        {

            headers:{

                "Content-Type":"multipart/form-data"

            }

        }

    );

    return response.data;

};

export const getMyComplaints = async () => {

    const response = await api.get(

        "/complaints/my"

    );

    return response.data;

};

export const getAdminComplaints = async (params = {}) => {
    const response = await api.get("/complaints/admin", { params });
    return response.data;
};

export const updateComplaintReply = async (id, data) => {
    const response = await api.put(`/complaints/reply/${id}`, data);
    return response.data;
};

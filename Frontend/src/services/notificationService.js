import api from "./api";

export const getNotifications = async () => {

    const response = await api.get("/notifications");

    return response.data;

};

export const markAsRead = async(id)=>{

    const response = await api.put(

        `/notifications/${id}/read`

    );

    return response.data;

};

export const getClashes = async()=>{

    const response=await api.get(

        "/clashes"

    );

    return response.data;

};
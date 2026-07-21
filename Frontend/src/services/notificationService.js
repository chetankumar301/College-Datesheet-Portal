import api from "./api";

export const getNotifications = async () => {

    const response = await api.get("/notifications");

    return response.data;

};

export const markAsRead = async(id)=>{

    const response = await api.put(

        `/notifications/${id}`

    );

    return response.data;

};

export const getClashes = async()=>{

    const response=await api.get(

        "/clashes"

    );

    return response.data;

};

export const markAllAsRead = async()=>{
    const response = await api.put("/notifications/mark-all-read");
    return response.data;
};

export const deleteNotification = async(id)=>{
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

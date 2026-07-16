import api from "./api";

export const getAllSubscriptions = async () => {
    const response = await api.get("/subscriptions/subscriptions");
    return response.data;
};

export const getSubscriptionByCollege = async (collegeId) => {
    const response = await api.get(`/subscriptions/subscriptions/college/${collegeId}`);
    return response.data;
};

export const createSubscription = async (subscriptionData) => {
    const response = await api.post("/subscriptions/subscriptions", subscriptionData);
    return response.data;
};

export const renewSubscription = async (id, subscriptionData) => {
    const response = await api.put(`/subscriptions/subscriptions/${id}/renew`, subscriptionData);
    return response.data;
};

export const cancelSubscription = async (id) => {
    const response = await api.put(`/subscriptions/subscriptions/${id}/cancel`);
    return response.data;
};

export const getRevenueAnalytics = async (params) => {
    const response = await api.get("/subscriptions/subscriptions/analytics/revenue", { params });
    return response.data;
};

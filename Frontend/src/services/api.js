import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:5000/api",
    withCredentials: true

});

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || "";
        const isAuthRequest =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/refresh") ||
            requestUrl.includes("/auth/logout");

        if (
            error.response?.status === 401 &&
            !originalRequest?._retry &&
            !isAuthRequest
        ) {

            originalRequest._retry = true;

            try {
                const response = await api.post("/auth/refresh");
                const token = response.data?.token;

                if (token) {
                    localStorage.setItem("token", token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem("token");
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 401 && !isAuthRequest) {

            localStorage.removeItem("token");

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }

        }

        return Promise.reject(error);

    }

);

export default api;

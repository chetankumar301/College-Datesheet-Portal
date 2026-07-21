import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import PageLoader from "../components/common/PageLoader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadUser();

    }, []);

    const loadUser = async () => {

        const token = localStorage.getItem("token");

        try {

            if (!token) {

                try {
                    const refreshRes = await api.post("/auth/refresh");
                    if (refreshRes.data?.token) {
                        localStorage.setItem("token", refreshRes.data.token);
                        setUser(refreshRes.data.user);
                    }
                } catch (err) {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
                return;

            }

            const res = await api.get("/auth/profile");

            if (localStorage.getItem("token") === token) {

                setUser(res.data.data);

            }

        }

        catch (err) {

            localStorage.removeItem("token");

            setUser(null);

        }

        finally {

            setLoading(false);

        }

    };

    const login = (token, userData) => {

        localStorage.setItem("token", token);

        setUser(userData);

        setLoading(false);

    };

    const logout = () => {
        api.post("/auth/logout").catch(() => {});

        localStorage.removeItem("token");

        setUser(null);

    };

    if (loading) {
        return <PageLoader />;
    }

    return (

        <AuthContext.Provider

            value={{

                user,

                loading: false,
                login,

                logout,

                loadUser

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);

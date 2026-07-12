import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

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

                return;

            }

            const res = await api.get("/auth/profile");

            if (localStorage.getItem("token") === token) {

                setUser(res.data.data);

            }

        }

        catch (err) {

            console.log(err);

            if (localStorage.getItem("token") === token) {

                localStorage.removeItem("token");

                setUser(null);

            }

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

        localStorage.removeItem("token");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

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
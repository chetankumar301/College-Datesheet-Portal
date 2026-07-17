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

                console.log("No token found, setting loading to false");
                setLoading(false);
                return;

            }

            console.log("Token found, fetching user profile");
            const res = await api.get("/auth/profile");

            if (localStorage.getItem("token") === token) {

                console.log("User profile loaded:", res.data.data);
                setUser(res.data.data);

            }

        }

        catch (err) {

            console.error("Error loading user:", err);

            localStorage.removeItem("token");

            setUser(null);

        }

        finally {

            console.log("Setting loading to false");
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

    if (loading) {
        return <div className="loading">Loading...</div>;
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
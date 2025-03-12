import { useState, useContext, createContext, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ''
    })

    // defaults
    axios.defaults.baseURL = "https://ecommerce-2025-backend-6ebc.onrender.com";
    axios.defaults.headers.common['Authorization'] = auth?.token;
    
    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parsedData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parsedData.user,
                token: parsedData.token
            })
        }
    }, [])
    
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };

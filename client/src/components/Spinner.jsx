import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Spinner() {
    const [count, setCount] = useState(5);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => prev - 1);
        }, 1000)
        count === 0 && navigate("/login", {
            state: location.pathname
        });
        return () => clearInterval(interval);
    }, [count, navigate, location])
    return (
        <div className="d-flex flex-column justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
            <h1>Navigating you to login page in {count} seconds</h1>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import '../../Styles/AuthStyles.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

    // Get remaining time from localStorage
    const getRemainingTime = () => {
        const startTime = localStorage.getItem("otpStartTime");
        if (!startTime) {
            const currentTime = Math.floor(Date.now() / 1000);
            localStorage.setItem("otpStartTime", currentTime);
            return OTP_EXPIRY_TIME;
        }
        const elapsedTime = Math.floor(Date.now() / 1000) - parseInt(startTime, 10);
        return Math.max(OTP_EXPIRY_TIME - elapsedTime, 0);
    };

    const [count, setCount] = useState(getRemainingTime());

    useEffect(() => {
        if (count === 0) {
            localStorage.removeItem("otpStartTime"); // Clear storage when expired
            navigate("/login");
            return;
        }

        const interval = setInterval(() => {
            setCount((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [count, navigate]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/change-password", {
                email,
                newPassword,
                otp,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                localStorage.removeItem("otpStartTime"); // Clear storage on success
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <Layout title={"Forgot Password - Ecommerce APP"}>
            <div className="form-container ">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>

                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="form-control"
                            placeholder="Enter OTP sent to your email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        RESET
                    </button>

                    <div className="mp-3">
                        <p style={{ color: "red" }}>OTP expires in {count} seconds.</p>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;

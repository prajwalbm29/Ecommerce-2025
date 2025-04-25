import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenue";
import { useAuth } from "../../Context/auth";
import { useNavigate } from "react-router-dom";
import "./Dashbord.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <UserMenu />
        </div>
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2 className="dashboard-title">User Profile</h2>
            <div className="user-info">
              <p>
                <strong>Name:</strong> {auth?.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {auth?.user?.email}
              </p>
              <p>
                <strong>Address:</strong> {auth?.user?.address || "Not Provided"}
              </p>
              <button className="edit-button" onClick={() => navigate("/dashboard/user/profile")}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

import { useAuth } from "../../Context/auth";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenue";
import "./Dashbord.css"; // Importing CSS file

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="admin-dashboard-container">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <AdminMenu />
        </div>

        {/* Admin Info */}
        <div className="admin-content">
          <div className="admin-card">
            <h3><strong>Admin Name:</strong> {auth?.user?.name}</h3>
            <h3><strong>Admin Email:</strong> {auth?.user?.email}</h3>
            <h3><strong>Admin Contact:</strong> {auth?.user?.phone || "Not Provided"}</h3>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

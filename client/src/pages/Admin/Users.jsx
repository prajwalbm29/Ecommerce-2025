import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenue";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.address || "No Address Provided"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;

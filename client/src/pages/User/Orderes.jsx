import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenue";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import { IMAGE_BASE_URL } from "../../constants/Image";
import moment from "moment";
import "./Orders.css"; // Importing CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data?.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="orders-container">
        {/* Sidebar */}
        <div className="sidebar">
          <UserMenu />
        </div>

        {/* Orders Content */}
        <div className="orders-content">
          <h2 className="orders-title">All Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center">No orders found.</p>
          ) : (
            orders.map((o, i) => (
              <div key={i} className="order-card">
                {/* Order Table */}
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{o?.status}</td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Products in the Order */}
                <div className="products-container">
                  {o?.products?.map((p) => (
                    <div key={p._id} className="product-card">
                      <img
                        src={`${IMAGE_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                        className="product-image"
                        alt={p.name}
                      />
                      <div className="product-details">
                        <p><strong>{p.name}</strong></p>
                        <p>{p.description.substring(0, 30)}...</p>
                        <p>Price: ${p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;

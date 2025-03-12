import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../Context/cart";
import { useAuth } from "../Context/auth";
import { useNavigate } from "react-router-dom";
import dropin from "braintree-web-drop-in";
import axios from "axios";
import toast from "react-hot-toast";
import "../Styles/CartStyles.css";
import { IMAGE_BASE_URL } from "../constants/Image";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Remove item from cart
  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error("Error fetching Braintree token:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getToken();
  }, [auth?.token]);

  useEffect(() => {
    const initializeDropIn = async () => {
      if (!clientToken) return;

      try {
        const dropinInstance = await dropin.create({
          authorization: clientToken,
          container: "#dropin-container",
        });
        setInstance(dropinInstance);
      } catch (error) {
        console.error("Drop-in error:", error);
      }
    };

    initializeDropIn();
  }, [clientToken]);


  // Handle payment
  const handlePayment = async () => {
    try {
      if (!instance) {
        toast.error("Payment instance not initialized");
        return;
      }
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post("/api/v1/product/braintree/payment", { nonce, cart });
      setLoading(false);
      setCart([]);
      localStorage.removeItem("cart");
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

return (
  <Layout>
    <div className="cart-page container">
      <div className="row">
        <div className="col-12 text-center bg-light p-2 mb-2">
          <h1>{auth?.user ? `Hello ${auth.user.name}` : "Hello Guest"}</h1>
          <p>{cart.length ? `You have ${cart.length} items in your cart.` : "Your Cart is Empty"}</p>
        </div>
      </div>
      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-7 col-md-7 col-12">
          {cart.map((p) => (
            <div className="row card flex-md-row flex-column align-items-center p-2 mb-2" key={p._id}>
              <div className="col-md-4 col-12 text-center">
                <img
                  src={`${IMAGE_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top img-fluid"
                  alt={p.name}
                  style={{ maxHeight: "130px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-4 col-12 text-center text-md-start">
                <p><strong>{p.name}</strong></p>
                <p>{p.description.substring(0, 30)}</p>
                <p>Price: {p.price}</p>
              </div>
              <div className="col-md-4 col-12 text-center">
                <button className="btn btn-danger btn-sm w-100 mt-2" onClick={() => removeCartItem(p._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Cart Summary */}
        <div className="col-lg-5 col-md-5 col-12 cart-summary mt-3 mt-md-0">
          <h2>Cart Summary</h2>
          <h4>Total: {totalPrice}</h4>
          {auth?.user?.address ? (
            <div className="mb-3">
              <h4>Current Address</h4>
              <h5>{auth.user.address}</h5>
              <button className="btn btn-outline-warning btn-sm w-100" onClick={() => navigate("/dashboard/user/profile")}>
                Update Address
              </button>
            </div>
          ) : (
            <button className="btn btn-outline-warning btn-sm w-100" onClick={() => navigate(auth?.token ? "/dashboard/user/profile" : "/login")}>
              {auth?.token ? "Update Address" : "Please Login to Checkout"}
            </button>
          )}
          {/* Payment Section */}
          <div className="mt-2">
            {clientToken && auth?.token && cart.length > 0 && (
              <>
                <div id="dropin-container"></div>
                <button className="btn btn-primary btn-sm w-100 mt-2" onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}>
                  {loading ? "Processing ..." : "Make Payment"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

};

export default CartPage;

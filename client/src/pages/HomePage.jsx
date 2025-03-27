import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import Prices from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/cart";
import toast from "react-hot-toast";
import { IMAGE_BASE_URL } from "../constants/Image";
import "../Styles/HomePage.css";
import Loading from "./Loading";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Amazon-Style E-Commerce"}>
      {/* Banner Image */}
      <div className="banner-container">
        <img src="/images/banner.png" className="banner-img" alt="banner" />
      </div>

      {
        loading ? (
          <Loading />
        ) : (
          <div className="container-fluid row mt-3">
            {/* Filters Section */}
            <div className="col-md-2 p-3">
              <div className="filter-container">
                <h5 className="filter-title">Filter by Category</h5>
                <div className="filter-options">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>

                <h5 className="filter-title mt-4">Filter by Price</h5>
                <div className="filter-options">
                  <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}>
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>

                <button
                  className="btn btn-danger w-100 mt-3"
                  onClick={() => window.location.reload()}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Products Section */}
            <div className="col-md-10">
              <h2 className="text-center mb-3">Featured Products</h2>
              <div className="product-grid">
                {products?.map((p) => (
                  <div className="product-card" key={p._id}>
                    <img
                      src={`${IMAGE_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                      className="product-image"
                      alt={p.name}
                    />
                    <div className="product-info">
                      <h5>{p.name}</h5>
                      <p className="product-description">
                        {p.description.substring(0, 50)}...
                      </p>
                      <p className="product-price">$ {p.price}</p>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-dark btn-sm ms-2"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem("cart", JSON.stringify([...cart, p]));
                          toast.success("Added to cart!");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="load-more-container">
                {products && products.length < total && (
                  <button
                    className="btn btn-warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Loading ..." : "Load More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      }
    </Layout>
  );
};

export default HomePage;

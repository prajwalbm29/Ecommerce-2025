import React, { useState, useEffect, useRef } from "react";
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
  const observer = useRef(null);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts(1);
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    if (page > 1) loadMore();
  }, [page]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      if (data?.success) setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${pageNum}`);
      setLoading(false);
      if (pageNum === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const loadMore = async () => {
    getAllProducts(page);
  };

  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/product-filters", { checked, radio });
      setProducts(data?.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    setChecked((prev) => (value ? [...prev, id] : prev.filter((c) => c !== id)));
  };

  useEffect(() => {
    const target = document.querySelector(".load-more-trigger");

    if (target) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && products.length < total) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1 }
      );

      observer.current.observe(target);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [products, total]);

  return (
    <Layout title={"Amazon-Style E-Commerce"}>
      <div className="banner-container">
        <img src="/images/banner.png" className="banner-img" alt="banner" />
      </div>

      {loading && page === 1 ? (
        <Loading />
      ) : (
        <div className="container-fluid row mt-3">
          {/* Filters Section */}
          <div className="col-md-2 p-3">
            <div className="filter-container">
              <h5 className="filter-title">Filter by Category</h5>
              {categories?.map((c) => (
                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                  {c.name}
                </Checkbox>
              ))}

              <h5 className="filter-title mt-4">Filter by Price</h5>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>

              <button className="btn btn-danger w-100 mt-3" onClick={() => window.location.reload()}>
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
                  <img src={`${IMAGE_BASE_URL}/api/v1/product/product-photo/${p._id}`} className="product-image" alt={p.name} />
                  <div className="product-info">
                    <h5>{p.name}</h5>
                    <p className="product-description">{p.description.substring(0, 50)}...</p>
                    <p className="product-price">$ {p.price}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/product/${p.slug}`)}>
                      View Details
                    </button>
                    <button
                      className="btn btn-success btn-sm ms-2"
                      onClick={() => {
                        setCart([...cart, p]); // Allows duplicate items
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

            <div className="load-more-trigger"></div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenue";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../constants/Image";
const Products = () => {
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-8 ">
          <h1 className="text-center">All Products List</h1>
          <div className="row">
            {products?.map((p) => (
              <div key={p._id} className="col-md-6 mb-3">
                <Link to={`/dashboard/admin/product/${p.slug}`} className="product-link">
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`${IMAGE_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
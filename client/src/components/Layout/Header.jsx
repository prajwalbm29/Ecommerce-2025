import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../Context/auth";
import toast from "react-hot-toast";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SearchInput from "../Form/SearchInput";
import { useCategory } from "../../hooks/useCategory";
import { useCart } from "../../Context/cart";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { categories } = useCategory();
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container-fluid px-4">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold text-warning">
            🛒 E-Shop
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <SearchInput />
              </li>

              {/* Home */}
              <li className="nav-item">
                <NavLink to="/" className="nav-link text-white">
                  Home
                </NavLink>
              </li>

              {/* Categories Dropdown - Dark Themed */}
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle text-white"
                  to="/categories"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </NavLink>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <NavLink to="/categories" className="dropdown-item">
                      All Categories
                    </NavLink>
                  </li>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category._id}>
                        <NavLink
                          to={`/category/${category.slug}`}
                          className="dropdown-item"
                        >
                          {category.name}
                        </NavLink>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item text-muted">
                        No categories found
                      </span>
                    </li>
                  )}
                </ul>
              </li>

              {/* Authentication Links */}
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link text-white">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link text-white">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  {/* User Dropdown - Dark Themed */}
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle d-flex align-items-center text-white"
                      data-bs-toggle="dropdown"
                    >
                      <FaUserCircle className="me-1" size={22} />
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                      <li>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role ? "admin" : "user"}`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item text-danger"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              {/* Cart Icon with Badge */}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link position-relative">
                  <FaShoppingCart size={22} className="text-white" />
                  {cart?.length > 0 && (
                    <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

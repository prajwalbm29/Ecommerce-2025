import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-title">Prajwal the Dev</h2>
        <p className="footer-text">All Rights Reserved &copy; {new Date().getFullYear()}</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

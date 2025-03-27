import React from "react";
import "../Styles/Loading.css"; // Create a separate CSS file for styling

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading products...</p>
    </div>
  );
};

export default Loading;

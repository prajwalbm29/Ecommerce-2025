import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  // Fetch categories once
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-categories");
        setCategories(data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use category context
export const useCategory = () => useContext(CategoryContext);

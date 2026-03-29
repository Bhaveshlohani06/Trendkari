import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js"; // ✅ ADD THIS
import { toast } from "react-toastify";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState("kota");
  const navigate = useNavigate();

  // Load saved location on app start
  useEffect(() => {
    const savedLocation = localStorage.getItem("trendkari_location");
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  
  const fetchPostsByLocation = async (location) => {
  try {
    setLoading(true);
    const { data } = await API.get(
      `/post/get-posts?location=${location}`
    );

    if (data?.success) {
      setBlogs(data.posts);
    }
  } catch (error) {
    toast.error("Failed to load posts");
  } finally {
    setLoading(false);
  }
};

  const changeLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("trendkari_location", newLocation);

        // navigate("/", { replace: true });
navigate(`/feed/${newLocation}`, { replace: true });  };

  return (
    <LocationContext.Provider value={{ location, changeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

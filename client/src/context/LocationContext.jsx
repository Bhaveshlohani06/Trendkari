import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState("kota");

  // Load saved location on app start
  useEffect(() => {
    const savedLocation = localStorage.getItem("trendkari_location");
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const changeLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem("trendkari_location", newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, changeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

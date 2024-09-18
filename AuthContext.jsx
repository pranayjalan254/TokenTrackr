import { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext to hold authentication state and methods
const AuthContext = createContext();

// AuthProvider component to wrap around your app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check local storage on initial render to see if the user is authenticated
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    // Provide authentication state and methods to the rest of the app
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access authentication context
export const useAuth = () => useContext(AuthContext);

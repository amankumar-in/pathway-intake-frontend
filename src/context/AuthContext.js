import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, getMe } from "../utils/api";
import { jwtDecode } from "jwt-decode";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired, remove from localStorage
            localStorage.removeItem("token");
            setUser(null);
          } else {
            // Token valid, get user info
            const response = await getMe();

            // Check response structure - getMe returns {success, data}
            // where data contains the user info
            if (response.success && response.data) {
              setUser(response.data);
              console.log("User data loaded:", response.data);
            } else {
              console.error("Unexpected getMe response structure:", response);
              localStorage.removeItem("token");
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login user
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await apiLogin(username, password);

      // Store token in localStorage
      localStorage.setItem("token", response.token);

      // Set user in state
      setUser(response.user);

      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

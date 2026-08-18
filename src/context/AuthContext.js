import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getMe } from "../utils/api";

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
        const response = await getMe();
        if (response.success && response.data) {
          setUser(response.data);
          console.log("User data loaded:", response.data);
        } else {
          console.error("Unexpected getMe response structure:", response);
          setUser(null);
        }
      } catch (err) {
        // Normal if cookie is missing/expired
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

      // Set user in state
      setUser(response.user);

      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
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

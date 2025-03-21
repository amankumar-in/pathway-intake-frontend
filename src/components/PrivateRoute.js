import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If route is admin-only and user is not admin, redirect to home
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Return the children (the protected component)
  return children;
};

export default PrivateRoute;

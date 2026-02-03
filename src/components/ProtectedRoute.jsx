import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role"); // read role

  if (!userRole) return <Navigate to="/login" />; // not logged in
  if (userRole !== role) return <Navigate to="/login" />; // wrong role

  return children; // correct role → allow
};

export default ProtectedRoute;

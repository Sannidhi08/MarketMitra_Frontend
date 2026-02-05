import { Navigate } from "react-router-dom";

const ProtectedFarmerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "farmer") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedFarmerRoute;
import { Navigate } from "react-router-dom";

const ProtectedFarmerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const status = localStorage.getItem("status");

  if (!token) return <Navigate to="/login" replace />;

  if (role !== "farmer") {
    return <Navigate to="/login" replace />;
  }

  if (status !== "approved") {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

export default ProtectedFarmerRoute;

import { Navigate } from "react-router-dom";

const ProtectedFarmerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "farmer") {
    return <Navigate to="/login" replace />;
  }

  // ✅ ONLY BLOCK IF REALLY NOT APPROVED
  if (user.status !== "approved") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedFarmerRoute;

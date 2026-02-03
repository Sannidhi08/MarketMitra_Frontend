import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import AdminLayout from "./admin/AdminLayout";
import FarmerLayout from "./farmer/FarmerLayout";
import UserLayout from "./user/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard layouts */}
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/farmer/*" element={<FarmerLayout />} />
        <Route path="/user/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

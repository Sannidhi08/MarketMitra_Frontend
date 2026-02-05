import { BrowserRouter, Routes, Route } from "react-router-dom";

/* -------- PUBLIC -------- */
import PublicLayout from "./layouts/PublicLayout";
import Home from "./public/Home";
import PublicProducts from "./public/PublicProducts";
import Login from "./auth/Login";
import Register from "./auth/Register";
import About from "./public/About";
import Contact from "./public/Contact";

/* -------- DASHBOARDS -------- */
import AdminLayout from "./admin/AdminLayout";
import FarmerLayout from "./farmer/FarmerLayout";
import UserLayout from "./user/UserLayout";
import Cart from "./user/Cart";

/* -------- PROTECTED ROUTES -------- */
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedFarmerRoute from "./routes/ProtectedFarmerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* -------- PUBLIC PAGES -------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<PublicProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* -------- USER DASHBOARD -------- */}
        <Route
          path="/user/*"
          element={
            <ProtectedUserRoute>
              <UserLayout />
            </ProtectedUserRoute>
          }
        />

        {/* -------- FARMER DASHBOARD -------- */}
        <Route
          path="/farmer/*"
          element={
            <ProtectedFarmerRoute>
              <FarmerLayout />
            </ProtectedFarmerRoute>
          }
        />

        {/* -------- ADMIN DASHBOARD -------- */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

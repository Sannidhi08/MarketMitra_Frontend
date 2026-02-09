import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Box, Button, Paper, AppBar, Toolbar, Typography } from "@mui/material";

import FarmerDashboard from "./FarmerDashboard";
import ManageProducts from "./ManageProducts";
import ViewOrders from "./ViewOrders";
import ViewArticles from "./ViewArticles";
import ManageJobs from "./ManageJobs";
import ChangePassword from "./ChangePassword";

// Sidebar link styling
const linkStyle = ({ isActive }) => ({
  width: "100%",
  marginBottom: "8px",
  backgroundColor: isActive ? "#2e7d32" : "#e0e0e0",
  color: isActive ? "#fff" : "#000",
});

const FarmerLayout = () => {
  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // clear role & email
    window.location.href = "/login"; // redirect to login
  };

  return (
    <Box>
      {/* Top Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Farmer Panel
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar + Page Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Paper sx={{ width: 220, height: "100vh", p: 2 }}>
          <Button component={NavLink} to="/farmer" end style={linkStyle}>
            Dashboard
          </Button>
          <Button component={NavLink} to="/farmer/products" style={linkStyle}>
            Products
          </Button>
          <Button component={NavLink} to="/farmer/orders" style={linkStyle}>
            Orders
          </Button>
          <Button component={NavLink} to="/farmer/articles" style={linkStyle}>
            Articles
          </Button>
          <Button component={NavLink} to="/farmer/jobs" style={linkStyle}>
            Jobs
          </Button>
          <Button component={NavLink} to="/farmer/change-password" style={linkStyle}>
            Change Password
          </Button>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* RELATIVE paths for nested routes */}
            <Route index element={<FarmerDashboard />} />

            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ViewOrders />} />
            <Route path="articles" element={<ViewArticles />} />
            <Route path="jobs" element={<ManageJobs />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default FarmerLayout;

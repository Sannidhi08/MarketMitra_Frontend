import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Box, Button, Paper, AppBar, Toolbar, Typography } from "@mui/material";

import UserDashboard from "./UserDashboard";

import Cart from "./Cart";
import Orders from "./Orders";



// Sidebar link style
const linkStyle = ({ isActive }) => ({
  width: "100%",
  marginBottom: "8px",
  backgroundColor: isActive ? "#1976d2" : "#e0e0e0",
  color: isActive ? "#fff" : "#000",
});

const UserLayout = () => {
  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <Box>
      {/* Top Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Panel
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar + Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Paper sx={{ width: 220, height: "100vh", p: 2 }}>
          <Button component={NavLink} to="/user" end style={linkStyle}>
            Dashboard
          </Button>
          
          <Button component={NavLink} to="/user/cart" style={linkStyle}>
            Cart
          </Button>
          <Button component={NavLink} to="/user/orders" style={linkStyle}>
            Orders
          </Button>
          
          
        </Paper>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* RELATIVE paths for nested routes */}
            <Route path="/" element={<UserDashboard />} />
            
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            
           
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;

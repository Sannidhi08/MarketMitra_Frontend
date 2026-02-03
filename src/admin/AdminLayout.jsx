import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Box, Button, Paper, AppBar, Toolbar, Typography } from "@mui/material";

import AdminDashboard from "./AdminDashboard";
import ManageCategories from "./ManageCategories";
import ManageUsers from "./ManageUsers";
import ManageArticles from "./ManageArticles";
import ChangePassword from "./ChangePassword";

// Sidebar link styling
const linkStyle = ({ isActive }) => ({
  width: "100%",
  marginBottom: "8px",
  backgroundColor: isActive ? "#1976d2" : "#e0e0e0",
  color: isActive ? "#fff" : "#000",
});

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // redirect to login
  };

  return (
    <Box>
      {/* Navbar with Logout */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel
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
          <Button component={NavLink} to="/admin" end style={linkStyle}>
            Dashboard
          </Button>
          <Button component={NavLink} to="/admin/categories" style={linkStyle}>
            Manage Categories
          </Button>
          <Button component={NavLink} to="/admin/users" style={linkStyle}>
            Manage Users
          </Button>
          <Button component={NavLink} to="/admin/articles" style={linkStyle}>
            Manage Articles
          </Button>
          <Button component={NavLink} to="/admin/change-password" style={linkStyle}>
            Change Password
          </Button>
        </Paper>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* CHILD ROUTES MUST BE RELATIVE */}
            <Route path="/" element={<AdminDashboard />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;

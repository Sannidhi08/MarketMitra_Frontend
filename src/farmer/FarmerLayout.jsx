import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";

/* Icons */
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArticleIcon from "@mui/icons-material/Article";
import WorkIcon from "@mui/icons-material/Work";
import LogoutIcon from "@mui/icons-material/Logout";

/* Pages */
import FarmerDashboard from "./FarmerDashboard";
import ManageProducts from "./ManageProducts";
import ViewOrders from "./ViewOrders";
import ViewArticles from "./ViewArticles";
import ManageJobs from "./ManageJobs";

const FarmerLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* Sidebar Menu */
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/farmer" },
    { text: "Products", icon: <InventoryIcon />, path: "/farmer/products" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/farmer/orders" },
    { text: "Articles", icon: <ArticleIcon />, path: "/farmer/articles" },
    { text: "Jobs", icon: <WorkIcon />, path: "/farmer/jobs" }
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <Paper
        elevation={0}
        sx={{
          width: 260,
          height: "100vh",
          position: "fixed",
          borderRight: "1px solid #e0e0e0",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#2e7d32", letterSpacing: 1 }}
          >
            MARKET MITRA
          </Typography>
          <Typography variant="caption" color="text.secondary">
            FARMER PANEL
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Menu */}
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/farmer" && location.pathname === "/farmer/");

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  end={item.path === "/farmer"}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "#e8f5e9" : "transparent",
                    color: isActive ? "#2e7d32" : "#5f6368",
                    "&:hover": { bgcolor: "#f1f8e9" },
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#2e7d32" : "#5f6368"
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Logout */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, ml: "260px" }}>

        {/* Topbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <Toolbar>
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, color: "#202124", fontWeight: 500 }}
            >
              Farmer Management
            </Typography>

            {/* profile circle placeholder */}
            <Box
              sx={{
                bgcolor: "#e0e0e0",
                width: 35,
                height: 35,
                borderRadius: "50%"
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 4 }}>
          <Routes>
            <Route path="/" element={<FarmerDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ViewOrders />} />
            <Route path="articles" element={<ViewArticles />} />
            <Route path="jobs" element={<ManageJobs />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default FarmerLayout;
import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { 
  Box, Button, Paper, AppBar, Toolbar, Typography, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider 
} from "@mui/material";

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

import AdminDashboard from "./AdminDashboard";
import ManageCategories from "./ManageCategories";
import ManageUsers from "./ManageUsers";
import ManageArticles from "./ManageArticles";


const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Users & Farmers", icon: <GroupIcon />, path: "/admin/users" },
    { text: "Articles", icon: <DescriptionIcon />, path: "/admin/articles" },
    
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: 260, 
          height: "100vh", 
          position: "fixed", 
          borderRight: "1px solid #e0e0e0",
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2e7d32', letterSpacing: 1 }}>
            MARKET MITRA
          </Typography>
          <Typography variant="caption" color="text.secondary">ADMIN PANEL</Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin/");
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={NavLink} 
                  to={item.path}
                  end={item.path === "/admin"}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: isActive ? "#e8f5e9" : "transparent",
                    color: isActive ? "#2e7d32" : "#5f6368",
                    "&:hover": { bgcolor: "#f1f8e9" },
                    "& .MuiListItemIcon-root": { color: isActive ? "#2e7d32" : "#5f6368" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, ml: "260px" }}>
        <AppBar 
          position="sticky" 
          elevation={0} 
          sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e0e0e0" }}
        >
          <Toolbar>
            <Typography variant="body1" sx={{ flexGrow: 1, color: "#202124", fontWeight: 500 }}>
              System Management
            </Typography>
            <Box sx={{ bgcolor: '#e0e0e0', width: 35, height: 35, borderRadius: '50%' }} />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="articles" element={<ManageArticles />} />
            
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
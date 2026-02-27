import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Badge,
  Typography
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Ensure your logo path is correct
import logo from "../assets/Gemini_Generated_Image_ailauaailauaaila-removebg-preview.png";

const PublicHeader = ({ isLoggedIn, user, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path
  const [count, setCount] = useState(0);

  const updateCart = () => {
    const userId = localStorage.getItem("userId");
    const key = userId ? `cart_${userId}` : "guest_cart";
    const cart = JSON.parse(localStorage.getItem(key)) || [];
    const total = cart.reduce((s, i) => s + i.qty, 0);
    setCount(total);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("authChanged", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("authChanged", updateCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  const handleCartClick = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) navigate("/login");
    else navigate("/user/cart");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ maxWidth: "1200px", width: "100%", mx: "auto", py: 1 }}>
        
        {/* Logo Section */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 5,
            height: "80px",
          }}
        >
          <img 
            src={logo} 
            alt="Market Mitra Logo" 
            style={{ height: "100%", width: "auto" }} 
          />
        </Box>

        {/* Navigation Links with Active Highlighter */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          {[
            { label: "Home", path: "/" },
            { label: "Products", path: "/products" },
            { label: "Articles", path: "/articles" },
            { label: "Jobs", path: "/jobs" },
          ].map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  color: isActive ? "#166534" : "#374151",
                  fontWeight: isActive ? 700 : 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 2,
                  // Active state styles
                  backgroundColor: isActive ? "#f0fdf4" : "transparent",
                  borderBottom: isActive ? "2px solid #166534" : "2px solid transparent",
                  borderRadius: 0,
                  "&:hover": { 
                    backgroundColor: "#f0fdf4", 
                    color: "#166534" 
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Cart Icon */}
        <IconButton
          onClick={handleCartClick}
          sx={{ mr: 2, color: "#374151", "&:hover": { backgroundColor: "#f3f4f6" } }}
        >
          <Badge badgeContent={count} sx={{ "& .MuiBadge-badge": { backgroundColor: "#dc2626", color: "#ffffff" } }}>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Auth Section */}
        {!isLoggedIn ? (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              backgroundColor: "#166534",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#14532d" },
            }}
          >
            Login
          </Button>
        ) : (
          <>
            <Typography sx={{ mr: 2, fontWeight: 500, color: "#374151" }}>
              {user?.name || "User"}
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#166534",
                color: "#166534",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#f0fdf4", borderColor: "#14532d" },
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;
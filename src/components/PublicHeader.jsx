
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

import logo from "../assets/Gemini_Generated_Image_ailauaailauaaila-removebg-preview.png";

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const updateCart = () => {
    const uid = localStorage.getItem("userId");
    const key = uid ? `cart_${uid}` : "guest_cart";
    const cart = JSON.parse(localStorage.getItem(key)) || [];
    const total = cart.reduce((s, i) => s + i.qty, 0);
    setCartCount(total);
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setUserId(localStorage.getItem("userId"));
      setUserName(localStorage.getItem("userName"));
      updateCart();
    };

    updateCart();

    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  const handleCartClick = () => {
    const uid = localStorage.getItem("userId");
    if (!uid) navigate("/login");
    else navigate("/cart");
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

        {/* Logo */}
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

        {/* Navigation */}
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
                  backgroundColor: isActive ? "#f0fdf4" : "transparent",
                  borderBottom: isActive
                    ? "2px solid #166534"
                    : "2px solid transparent",
                  borderRadius: 0,
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    color: "#166534",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}

          {userId && (
            <Button
              component={Link}
              to="/my-orders"
              sx={{
                color:
                  location.pathname === "/my-orders"
                    ? "#166534"
                    : "#374151",
                fontWeight:
                  location.pathname === "/my-orders" ? 700 : 500,
                textTransform: "none",
                px: 2,
                backgroundColor:
                  location.pathname === "/my-orders"
                    ? "#f0fdf4"
                    : "transparent",
                borderBottom:
                  location.pathname === "/my-orders"
                    ? "2px solid #166534"
                    : "2px solid transparent",
                borderRadius: 0,
              }}
            >
              My Orders
            </Button>
          )}
        </Box>

        {/* Cart */}
        <IconButton
          onClick={handleCartClick}
          sx={{
            mr: 2,
            color: "#374151",
            "&:hover": { backgroundColor: "#f3f4f6" },
          }}
        >
          <Badge
            badgeContent={cartCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#dc2626",
                color: "#ffffff",
              },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Auth Section */}

        {!userId && location.pathname !== "/login" && (
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
        )}

        {userId && (
          <>
            <Typography sx={{ mr: 2, fontWeight: 500, color: "#374151" }}>
              {userName || "User"}
            </Typography>

            <Button
              onClick={handleLogout}
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
              Logout
            </Button>
          </>
        )}

      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;


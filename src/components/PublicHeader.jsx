import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";

const PublicHeader = ({ isLoggedIn, user, setIsLoggedIn }) => {
  const navigate = useNavigate();
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
      <Toolbar sx={{ maxWidth: "1200px", width: "100%", mx: "auto" }}>

        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            fontWeight: 700,
            color: "#166534",
            mr: 5,
            letterSpacing: 0.5,
          }}
        >
          Market Mitra
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          {[
            { label: "Home", path: "/" },
            { label: "Products", path: "/products" },
            { label: "Articles", path: "/articles" },
            { label: "Jobs", path: "/jobs" },
          ].map((item, index) => (
            <Button
              key={index}
              component={Link}
              to={item.path}
              sx={{
                color: "#374151",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  color: "#166534",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
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
            badgeContent={count}
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
              "&:hover": {
                backgroundColor: "#14532d",
              },
            }}
          >
            Login
          </Button>
        ) : (
          <>
            <Typography
              sx={{
                mr: 2,
                fontWeight: 500,
                color: "#374151",
              }}
            >
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
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  borderColor: "#14532d",
                },
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
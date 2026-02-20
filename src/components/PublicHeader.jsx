import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button,
  Box, IconButton, Badge
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
    <AppBar position="static">
      <Toolbar>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", mr: 4 }}
        >
          Market Mitra
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/articles">Articles</Button>
          <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
          <Button color="inherit" component={Link} to="/contact">Contact</Button>
        </Box>

        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={count} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {!isLoggedIn ? (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        ) : (
          <>
            <Typography sx={{ mr: 2 }}>
              {user?.name || "User"}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;

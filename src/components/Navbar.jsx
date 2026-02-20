import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button,
  IconButton, Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [cartCount, setCartCount] = useState(0);

  const loadCart = uid => {
    if (!uid) return setCartCount(0);

    const cart = JSON.parse(localStorage.getItem(`cart_${uid}`)) || [];
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  };

  useEffect(() => {
    loadCart(userId);
  }, [userId]);

  useEffect(() => {
    const handleAuth = () => {
      const uid = localStorage.getItem("userId");
      setUserId(uid);
      loadCart(uid);
    };

    const handleCart = () => {
      const uid = localStorage.getItem("userId");
      loadCart(uid);
    };

    window.addEventListener("authChanged", handleAuth);
    window.addEventListener("cartUpdated", handleCart);

    return () => {
      window.removeEventListener("authChanged", handleAuth);
      window.removeEventListener("cartUpdated", handleCart);
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
    else navigate("/user/cart");
  };

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Market Mitra
        </Typography>

        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/articles">Articles</Button>
        <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>

        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {userId && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

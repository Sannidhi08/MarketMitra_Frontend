import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [cartCount, setCartCount] = useState(0);

  const loadCart = (uid) => {
    if (!uid) {
      setCartCount(0);
      return;
    }

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

  // ✅ FIXED ROUTE
  const handleCartClick = () => {
    const uid = localStorage.getItem("userId");
    if (!uid) navigate("/login");
    else navigate("/cart");
  };

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Market Mitra
        </Typography>

        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{ fontWeight: location.pathname === "/" ? 700 : 400 }}
        >
          Home
        </Button>

        <Button
          color="inherit"
          component={Link}
          to="/articles"
          sx={{ fontWeight: location.pathname === "/articles" ? 700 : 400 }}
        >
          Articles
        </Button>

        <Button
          color="inherit"
          component={Link}
          to="/jobs"
          sx={{ fontWeight: location.pathname === "/jobs" ? 700 : 400 }}
        >
          Jobs
        </Button>

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
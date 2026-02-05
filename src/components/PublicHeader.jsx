import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const PublicHeader = ({ isLoggedIn, user, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* LOGO */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            mr: 4
          }}
        >
          Market Mitra
        </Typography>

        {/* NAV LINKS */}
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>

          <Button color="inherit" component={Link} to="/about">
            About
          </Button>

          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
        </Box>

        {/* AUTH */}
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

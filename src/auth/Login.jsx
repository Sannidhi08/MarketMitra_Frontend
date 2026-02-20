import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    /* VALIDATION */
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { success, user, token, message } = res.data;

      /* LOGIN FAILED */
      if (!success) {
        setError(message || "Login failed");
        return;
      }

      /* FARMER APPROVAL CHECK */
      if (user.role === "farmer" && user.status !== "approved") {
        setError("Your farmer account is pending admin approval.");
        return;
      }

      /* SAVE LOGIN DATA */
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
       if (user.role === "farmer") {
  localStorage.setItem("farmerId", user.id);
}

      /* 🔥 NOTIFY NAVBAR LOGIN SUCCESS */
      window.dispatchEvent(new Event("authChanged"));

      /* ---------------------------- */
      /* MERGE GUEST CART → USER CART */
      /* ---------------------------- */

      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      if (guestCart.length > 0) {
        const userCartKey = `cart_${user.id}`;
        const userCart =
          JSON.parse(localStorage.getItem(userCartKey)) || [];

        const mergedCart = [...userCart];

        guestCart.forEach(item => {
          const exists = mergedCart.find(i => i.id === item.id);

          if (exists) exists.qty += item.qty;
          else mergedCart.push(item);
        });

        localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("guest_cart");

        /* 🔥 NOTIFY NAVBAR CART UPDATED */
        window.dispatchEvent(new Event("cartUpdated"));
      }

      /* ---------------------------- */
      /* REDIRECT BACK AFTER LOGIN */
      /* ---------------------------- */

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
        return;
      }

      /* ---------------------------- */
      /* ROLE BASED NAVIGATION */
      /* ---------------------------- */

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "farmer") navigate("/farmer");
      else navigate("/user");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ENTER KEY LOGIN */
  const handleKeyPress = e => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 400,
        margin: "auto",
        mt: 10,
        borderRadius: 3
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center">
        Login
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <Button
  onClick={() => navigate("/forgot-password")}
  sx={{ textTransform:"none", mt:1 }}
>
  Forgot Password?
</Button>


      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, height: 45 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          onClick={() => navigate("/register")}
          sx={{ textTransform: "none" }}
        >
          Don’t have an account? Register
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;

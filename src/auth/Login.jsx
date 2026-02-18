import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
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

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const { success, user, token, message } = response.data;

      if (!success) {
        setError(message || "Login failed");
        setLoading(false);
        return;
      }

      /* 🚫 BLOCK FARMER IF NOT APPROVED */
      if (user.role === "farmer" && user.status !== "approved") {
        setError("Your farmer account is pending admin approval.");
        setLoading(false);
        return;
      }

      /* ✅ SAVE LOGIN DATA */
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      /* 🛒 MERGE GUEST CART → USER CART */
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      if (guestCart.length > 0) {
        const userCartKey = `cart_${user.id}`;
        const userCart =
          JSON.parse(localStorage.getItem(userCartKey)) || [];

        const merged = [...userCart];

        guestCart.forEach(g => {
          const exist = merged.find(i => i.id === g.id);
          if (exist) exist.qty += g.qty;
          else merged.push(g);
        });

        localStorage.setItem(userCartKey, JSON.stringify(merged));
        localStorage.removeItem("guest_cart");
      }

      /* 🔁 CHECK REDIRECT AFTER LOGIN */
      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
        return;
      }

      /* 🔀 ROLE BASED REDIRECT */
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/user");
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, margin: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
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
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
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

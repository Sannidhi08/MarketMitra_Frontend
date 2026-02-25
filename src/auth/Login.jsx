import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Container
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

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { success, user, token, message } = res.data;

      if (!success) {
        setError(message || "Login failed");
        return;
      }

      if (user.role === "farmer" && user.status !== "approved") {
        setError("Your farmer account is pending admin approval.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "farmer") {
        localStorage.setItem("farmerId", user.id);
      }

      window.dispatchEvent(new Event("authChanged"));

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

        window.dispatchEvent(new Event("cartUpdated"));
      }

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
        return;
      }

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

  const handleKeyPress = e => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              fontWeight: 700,
              color: "#166534",
              mb: 1
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "#6b7280", mb: 3 }}
          >
            Login to continue to Market Mitra
          </Typography>

          {/* Error */}
          {error && (
            <Box
              sx={{
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                p: 1.5,
                borderRadius: 2,
                mb: 2,
                fontSize: "0.9rem"
              }}
            >
              {error}
            </Box>
          )}

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          {/* Forgot Password */}
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Button
              onClick={() => navigate("/forgot-password")}
              sx={{
                textTransform: "none",
                fontSize: "0.85rem",
                color: "#166534",
                "&:hover": { backgroundColor: "transparent" }
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: "#166534",
              "&:hover": { backgroundColor: "#14532d" }
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            ) : (
              "Login"
            )}
          </Button>

          {/* Register */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                color: "#166534",
                fontWeight: 500
              }}
            >
              Don’t have an account? Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
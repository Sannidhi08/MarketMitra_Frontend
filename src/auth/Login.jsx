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
  setLoading(true);

  if (!email || !password) {
    setError("Email and password are required");
    setLoading(false);
    return;
  }

  console.log("🔍 DEBUG: Starting login process...");

  try {
    console.log("🔍 DEBUG: Calling loginUser function...");
    const response = await loginUser({ email, password });
    
    // 🔍 LOG THE FULL RESPONSE
    console.log("✅ DEBUG: Full login response:", response);
    console.log("✅ DEBUG: Response data type:", typeof response);
    console.log("✅ DEBUG: Response keys:", Object.keys(response));
    
    // Check if it's an axios response object
    if (response.data) {
      console.log("✅ DEBUG: Axios response - data exists:", response.data);
      const { user, token, message } = response.data;
      
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      if (token) {
        localStorage.setItem("token", token);
      }
      
      // Redirect based on role
      if (user && user.role) {
        switch (user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "farmer":
            navigate("/farmer/dashboard");
            break;
          case "user":
            navigate("/user/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("User data missing from response");
      }
    } 
    // Check if it's the direct data (from fetch test)
    else if (response.user) {
      console.log("✅ DEBUG: Direct data - user exists:", response.user);
      
      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      
      if (response.user.role) {
        switch (response.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "farmer":
            navigate("/farmer/dashboard");
            break;
          case "user":
            navigate("/user/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    }
    else {
      console.error("❌ DEBUG: Unexpected response structure:", response);
      setError("Unexpected response from server");
    }

  } catch (err) {
    console.error("❌ DEBUG: Full error:", err);
    console.error("❌ DEBUG: Error response:", err.response?.data);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  // Add a test button to check the endpoint
  const testEndpoint = async () => {
    console.log("🧪 Testing endpoint directly...");
    try {
      const response = await fetch('http://localhost:3003/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      });
      console.log("🧪 Test response status:", response.status);
      const data = await response.json();
      console.log("🧪 Test response data:", data);
    } catch (error) {
      console.error("🧪 Test error:", error);
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
        required
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
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

      {/* Add a test button */}
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
        onClick={testEndpoint}
      >
        Test Endpoint
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          onClick={() => navigate("/register")}
          sx={{ textTransform: "none" }}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;
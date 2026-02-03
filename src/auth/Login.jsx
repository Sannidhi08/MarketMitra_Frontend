import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Auto redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/admin");
    else if (role === "farmer") navigate("/farmer");
    else if (role === "user") navigate("/user");
  }, []);

  const handleLogin = () => {
    let userRole = "";

    // MOCK LOGIN (replace with backend call later)
    if (email === "admin@gmail.com") userRole = "admin";
    else if (email === "farmer@gmail.com") userRole = "farmer";
    else userRole = "user";

    // Store role and email in LocalStorage
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", email);

    // Redirect based on role
    if (userRole === "admin") navigate("/admin");
    else if (userRole === "farmer") navigate("/farmer");
    else navigate("/user");
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, margin: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <TextField
        label="Email"
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
      >
        Login
      </Button>
    </Paper>
  );
};

export default Login;

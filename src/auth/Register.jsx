import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      await registerUser({ name, email, password, role });

      setSuccess("Registration successful! Please login.");

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, margin: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="green" sx={{ mb: 1 }}>
          {success}
        </Typography>
      )}

      <TextField
        label="Full Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          label="Role"
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="user">User (Buyer)</MenuItem>
          <MenuItem value="farmer">Farmer (Seller)</MenuItem>
          <MenuItem value="admin">Administrator</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        <strong>Role descriptions:</strong><br />
        • <strong>User</strong>: Can browse and purchase products<br />
        • <strong>Farmer</strong>: Can sell products and manage listings<br />
        • <strong>Admin</strong>: Full system access (approval required)
      </Typography>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleRegister}
      >
        Register
      </Button>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </Button>
    </Paper>
  );
};

export default Register;
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
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    // ✅ SET STATUS BASED ON ROLE
    const status = role === "farmer" ? "pending" : "approved";

    try {
      await registerUser({
        name,
        email,
        password,
        role,
        status,
      });

      if (role === "farmer") {
        setSuccess(
          "Registration successful! Your account is pending admin approval."
        );
      } else {
        setSuccess("Registration successful! Please login.");
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      setTimeout(() => navigate("/login"), 2000);
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
        </Select>
      </FormControl>

      {role === "farmer" && (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ mt: 1, display: "block" }}
        >
          ⚠ Farmer accounts require admin approval before login.
        </Typography>
      )}

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

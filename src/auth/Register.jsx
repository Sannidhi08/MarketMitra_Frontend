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
  Box,
  Container
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
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

    if (role === "farmer" && !phone) {
      setError("Phone number is required for farmers");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        role,
        phone: role === "farmer" ? phone : null,
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
      setPhone("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
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
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "#6b7280", mb: 3 }}
          >
            Join Market Mitra and start buying or selling fresh produce
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

          {/* Success */}
          {success && (
            <Box
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#166534",
                p: 1.5,
                borderRadius: 2,
                mb: 2,
                fontSize: "0.9rem"
              }}
            >
              {success}
            </Box>
          )}

          {/* Name */}
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role */}
          <FormControl fullWidth margin="normal">
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

          {/* Phone for Farmer */}
          {role === "farmer" && (
            <>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Box
                sx={{
                  backgroundColor: "#fffbeb",
                  color: "#b45309",
                  p: 1.5,
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  mt: 1
                }}
              >
                ⚠ Farmer accounts require admin approval before login.
              </Box>
            </>
          )}

          {/* Register Button */}
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
            onClick={handleRegister}
          >
            Register
          </Button>

          {/* Login Redirect */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                color: "#166534",
                fontWeight: 500
              }}
            >
              Already have an account? Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
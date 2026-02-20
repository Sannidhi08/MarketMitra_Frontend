import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    setError("");
    setMsg("");

    if (!email || !password) {
      setError("All fields required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3003/api/auth/forgot-password",
        { email, newPassword: password }
      );

      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <Paper sx={{ p:4, maxWidth:400, mx:"auto", mt:10 }}>
      <Typography variant="h5" textAlign="center">Reset Password</Typography>

      {error && <Typography color="error">{error}</Typography>}
      {msg && <Typography color="success.main">{msg}</Typography>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{mt:2}}
        onClick={handleReset}
      >
        Reset Password
      </Button>

      <Box textAlign="center" mt={2}>
        <Button onClick={()=>navigate("/login")}>
          Back to Login
        </Button>
      </Box>
    </Paper>
  );
};

export default ForgotPassword;

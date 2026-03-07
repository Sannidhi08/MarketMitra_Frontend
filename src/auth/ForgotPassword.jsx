import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box, Stack } from "@mui/material";
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

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#e8f5e9,#f1f8e9)"
      }}
    >

      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 3
        }}
      >

        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={700}
          color="#1b5e20"
          mb={2}
        >
          Reset Password
        </Typography>

        {error && (
          <Typography
            color="error"
            textAlign="center"
            mb={1}
          >
            {error}
          </Typography>
        )}

        {msg && (
          <Typography
            color="success.main"
            textAlign="center"
            mb={1}
          >
            {msg}
          </Typography>
        )}

        <Stack spacing={2} mt={1}>

          <TextField
            label="Email"
            fullWidth
            size="small"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            size="small"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              backgroundColor: "#2e7d32",
              "&:hover": {
                backgroundColor: "#1b5e20"
              }
            }}
            onClick={handleReset}
          >
            Reset Password
          </Button>

        </Stack>

        <Box textAlign="center" mt={2}>

          <Button
            size="small"
            sx={{ color: "#2e7d32" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>

        </Box>

      </Paper>

    </Box>

  );

};

export default ForgotPassword;


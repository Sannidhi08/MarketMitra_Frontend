import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = () => {
    alert("Password Changed Successfully");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Change Password
      </Typography>

      <TextField
        label="Old Password"
        type="password"
        fullWidth
        margin="normal"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Button variant="contained" sx={{ mt: 2 }}>
        Change Password
      </Button>
    </Paper>
  );
};

export default ChangePassword;

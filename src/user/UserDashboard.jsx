import React from "react";
import { Typography, Paper } from "@mui/material";

const UserDashboard = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      <Typography>
        Welcome! Browse products, manage your cart, and view orders.
      </Typography>
    </Paper>
  );
};

export default UserDashboard;

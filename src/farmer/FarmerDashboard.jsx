import React from "react";
import { Typography, Paper } from "@mui/material";

const FarmerDashboard = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Dashboard
      </Typography>
      <Typography>
        Welcome Farmer! Manage your products, orders, and job posts here.
      </Typography>
    </Paper>
  );
};

export default FarmerDashboard;

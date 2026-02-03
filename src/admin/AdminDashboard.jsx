import React from "react";
import { Typography, Paper } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        Welcome Admin! Manage categories, users, and articles here.
      </Typography>
    </Paper>
  );
};

export default AdminDashboard;

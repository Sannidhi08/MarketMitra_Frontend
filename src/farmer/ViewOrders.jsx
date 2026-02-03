import React from "react";
import { Typography, Paper } from "@mui/material";

const ViewOrders = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Orders
      </Typography>
      <Typography>
        View orders placed by customers.
      </Typography>
    </Paper>
  );
};

export default ViewOrders;

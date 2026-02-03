import React from "react";
import { Typography, Paper } from "@mui/material";

const Orders = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Orders
      </Typography>

      <Typography>
        Order history and status will be shown here.
      </Typography>
    </Paper>
  );
};

export default Orders;

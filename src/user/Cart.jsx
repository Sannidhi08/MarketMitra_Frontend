import React from "react";
import { Typography, Paper, Button } from "@mui/material";

const Cart = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Cart
      </Typography>

      <Typography>
        Selected products will appear here.
      </Typography>

      <Button variant="contained" color="success" sx={{ mt: 2 }}>
        Checkout
      </Button>
    </Paper>
  );
};

export default Cart;

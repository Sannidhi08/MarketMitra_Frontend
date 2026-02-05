import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button
} from "@mui/material";

const Cart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          {cart.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography>
                {item.name} × {item.qty}
              </Typography>
              <Typography>
                ₹{item.price * item.qty}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}

          <Typography variant="h6">
            Total: ₹{total}
          </Typography>

          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Checkout
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Cart;

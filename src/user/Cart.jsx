import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  Stack
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState([]);

  /* LOAD CART */
  useEffect(() => {
    if (!userId) return;

    const stored =
      JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

    setCart(stored);
  }, [userId]);

  /* SAVE CART */
  const updateCart = updated => {
    setCart(updated);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updated));
  };

  /* INCREASE */
  const increaseQty = id => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  /* DECREASE */
  const decreaseQty = id => {
    const updated = cart
      .map(item =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter(item => item.qty > 0);

    updateCart(updated);
  };

  /* REMOVE */
  const removeItem = id => {
    const updated = cart.filter(item => item.id !== id);
    updateCart(updated);
  };

  /* GRAND TOTAL */
  const grandTotal = cart.reduce(
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
          {cart.map(item => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">

                {/* IMAGE */}
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.product_name}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 8
                  }}
                />

                {/* DETAILS */}
                <Box flex={1}>
                  <Typography fontWeight="bold">
                    {item.product_name}
                  </Typography>

                  <Typography color="text.secondary">
                    ₹{item.price} × {item.qty}
                  </Typography>

                  {/* ITEM TOTAL */}
                  <Typography fontWeight="bold" color="primary">
                    ₹{item.price * item.qty}
                  </Typography>

                  {/* QTY CONTROL */}
                  <Stack direction="row" spacing={1} mt={1}>
                    <IconButton
                      size="small"
                      onClick={() => decreaseQty(item.id)}
                    >
                      <Remove />
                    </IconButton>

                    <Typography>{item.qty}</Typography>

                    <IconButton
                      size="small"
                      onClick={() => increaseQty(item.id)}
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                </Box>

                {/* DELETE */}
                <IconButton
                  color="error"
                  onClick={() => removeItem(item.id)}
                >
                  <Delete />
                </IconButton>
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}

          {/* GRAND TOTAL */}
          <Typography variant="h6" mt={2}>
            Total Amount: ₹{grandTotal}
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

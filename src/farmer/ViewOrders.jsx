import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Stack, CircularProgress } from "@mui/material";
import axios from "axios";

const API = "http://localhost:3003/orders";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const farmerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!farmerId) return;

        const res = await axios.get(`${API}/farmer/${farmerId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [farmerId]);

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!orders.length)
    return (
      <Box textAlign="center" mt={5}>
        <Typography>No orders yet</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Orders Received
      </Typography>

      {orders.map((order) => {
        let address = "N/A";
        try {
          if (order.address) {
            const a = JSON.parse(order.address);
            address = `${a.street}, ${a.city}, ${a.state} - ${a.pincode}`;
          }
        } catch {}

        return (
          <Paper key={order.id} sx={{ p: 3, mb: 3 }}>
            <Typography><b>Order ID:</b> {order.id}</Typography>
            <Typography><b>Date:</b> {new Date(order.created_at).toLocaleString()}</Typography>
            <Typography><b>Buyer:</b> {order.user_name} ({order.user_email})</Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              {order.items.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between">
                  <Typography>{item.product_name} × {item.quantity}</Typography>
                  <Typography>₹{item.price * item.quantity}</Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Total: ₹{order.total_amount}</Typography>
            <Typography><b>Payment:</b> {order.payment_method}</Typography>
            <Typography><b>Address:</b> {address}</Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ViewOrders;

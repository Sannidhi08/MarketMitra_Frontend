import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Divider
} from "@mui/material";
import axios from "axios";

const API = "http://localhost:3003/orders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!userId) return;

        const res = await axios.get(`${API}/user/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 3, mb: 3 }}>
          <Typography><b>Order ID:</b> {order.id}</Typography>

          <Typography mt={1}>
            <b>Date:</b> {new Date(order.created_at).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            {order.items.map((item) => (
              <Box key={item.id} display="flex" justifyContent="space-between">
                <Typography>
                  {item.product_name} × {item.quantity}
                </Typography>
                <Typography>
                  ₹{item.price * item.quantity}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">
            Total: ₹ {order.total_amount}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default Orders;

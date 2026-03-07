import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Divider,
  Chip,
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
        <Typography variant="h6">No orders yet</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Paper
          key={order.id}
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            backgroundColor: "#f9fafc",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold">
              Order #{order.id}
            </Typography>

            <Chip
              label="Completed"
              color="success"
              size="small"
            />
          </Stack>

          <Typography variant="body2" mt={1}>
            {new Date(order.created_at).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {order.items.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography>
                {item.product_name} × {item.quantity}
              </Typography>
              <Typography fontWeight="bold">
                ₹{item.price * item.quantity}
              </Typography>
            </Stack>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" textAlign="right">
            Total: ₹{order.total_amount}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default Orders;


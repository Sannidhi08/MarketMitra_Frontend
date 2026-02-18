import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Paper, Box,
  CircularProgress, Divider, Chip
} from "@mui/material";

const API = "http://localhost:3003";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/${userId}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 && (
        <Typography>No orders yet</Typography>
      )}

      {orders.map(order => (
        <Paper key={order.id} sx={{ p: 3, mb: 3 }}>

          {/* HEADER */}
          <Box display="flex" justifyContent="space-between">
            <Typography>
              <b>Order ID:</b> {order.id}
            </Typography>

            <Chip
              label={order.status}
              color={
                order.status === "pending" ? "warning" :
                order.status === "paid" ? "info" :
                order.status === "shipped" ? "secondary" :
                order.status === "delivered" ? "success" :
                "error"
              }
            />
          </Box>

          <Typography mt={1}>
            Date: {new Date(order.created_at).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* ITEMS */}
          {order.items.map(item => (
            <Box key={item.id}>
              {item.product_name} — ₹{item.price} × {item.quantity}
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* TOTAL */}
          <Typography variant="h6">
            Total: ₹ {order.total_amount}
          </Typography>

        </Paper>
      ))}
    </Box>
  );
};

export default Orders;

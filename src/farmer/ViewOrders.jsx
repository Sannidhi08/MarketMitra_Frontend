import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
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

  /* ================= LOADING ================= */
  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress color="success" />
      </Box>
    );

  /* ================= EMPTY ================= */
  if (!orders.length)
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary">
          No orders received yet 🌱
        </Typography>
      </Box>
    );

  /* ================= UI ================= */
  return (
    <Box sx={{ p: 4, backgroundColor: "#f1f8f4", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ fontWeight: 700, color: "#1b5e20" }}
      >
        📦 Orders Received
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
          <Paper
            key={order.id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              borderLeft: "6px solid #2e7d32",
            }}
          >
            {/* ===== ORDER HEADER ===== */}
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Typography fontWeight={600}>
                Order #{order.id}
              </Typography>
              <Chip
                label={order.payment_method}
                color="success"
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {new Date(order.created_at).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* ===== BUYER INFO ===== */}
            <Typography fontWeight={600} color="#2e7d32">
              Buyer Details
            </Typography>
            <Typography>
              {order.user_name} ({order.user_email})
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* ===== ITEMS ===== */}
            <Typography fontWeight={600} color="#2e7d32" mb={1}>
              Items
            </Typography>

            <Stack spacing={1}>
              {order.items.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography>
                    {item.product_name} × {item.quantity}
                  </Typography>
                  <Typography fontWeight={500}>
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* ===== TOTAL & ADDRESS ===== */}
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" color="#1b5e20">
                Total: ₹{order.total_amount}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 500 }}
              >
                <b>Delivery Address:</b> {address}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ViewOrders;
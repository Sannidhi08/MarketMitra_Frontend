import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";

const API = "http://localhost:3003";

const StatCard = ({ title, value, icon, color, loading }) => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      borderRadius: 4,
      transition: "0.3s",
      background: `linear-gradient(135deg, ${color}22, #ffffff)`,
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: 6,
      },
    }}
  >
    <Stack direction="row" spacing={3} alignItems="center">
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: color,
          color: "#fff",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={22} sx={{ mt: 1 }} />
        ) : (
          <Typography variant="h3" fontWeight="bold">
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const UserDashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    totalSpent: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!userId) return;

        const ordersRes = await axios.get(
          `${API}/orders/user/${userId}`
        );

        const orders = ordersRes.data.orders || [];

        const totalSpent = orders.reduce(
          (sum, order) => sum + Number(order.total_amount),
          0
        );

        setStats({
          orders: orders.length,
          totalSpent,
          recentOrders: orders.slice(0, 5),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #2e7d32, #66bb6a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back 👋
        </Typography>
        <Typography color="text.secondary">
          Here’s your shopping summary.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Total Orders"
            value={stats.orders}
            icon={<ReceiptLongIcon />}
            color="#2e7d32"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StatCard
            title="Total Amount Spent"
            value={`₹ ${stats.totalSpent}`}
            icon={<CurrencyRupeeIcon />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper
        elevation={3}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Recent Orders
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : stats.recentOrders.length === 0 ? (
          <Typography color="text.secondary">
            You haven’t placed any orders yet.
          </Typography>
        ) : (
          stats.recentOrders.map((order) => (
            <Box
              key={order.id}
              sx={{
                p: 2,
                mb: 2,
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

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >
                {new Date(order.created_at).toLocaleString()}
              </Typography>

              <Typography
                fontWeight="bold"
                mt={1}
                textAlign="right"
              >
                ₹ {order.total_amount}
              </Typography>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default UserDashboard;


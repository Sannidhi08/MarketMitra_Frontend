import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Container
} from "@mui/material";

import AgricultureIcon from "@mui/icons-material/Agriculture";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WorkIcon from "@mui/icons-material/Work";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

/* ---------- Stat Card ---------- */

const StatCard = ({ title, value, icon, color, loading }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      height: "100%",
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6
      }
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          p: 1.5,
          backgroundColor: `${color}20`,
          borderRadius: 2,
          color: color
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        {loading ? (
          <CircularProgress size={22} />
        ) : (
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

/* ---------- Farmer Dashboard ---------- */

const FarmerDashboard = () => {

  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    jobs: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const farmerId = localStorage.getItem("userId");

      const response = await axios.get(
        "http://localhost:3003/api/farmer/dashboard-stats",
        {
          headers: {
            "x-user-id": farmerId
          }
        }
      );

      if (response.data.success) {

        setCounts({
          products: Number(response.data.products) || 0,
          orders: Number(response.data.orders) || 0,
          jobs: Number(response.data.jobs) || 0
        });

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to fetch farmer dashboard stats"
      );

    } finally {

      setLoading(false);

    }
  };

  const pieData = [
    { name: "Products", value: counts.products },
    { name: "Orders", value: counts.orders },
    { name: "Jobs", value: counts.jobs }
  ];

  const COLORS = ["#2e7d32", "#1976d2", "#ed6c02"];

  return (

    <Container maxWidth="lg" sx={{ py: 5 }}>

      {/* HEADER */}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="success.main">
          Farmer Dashboard 🌾
        </Typography>

        <Typography color="text.secondary">
          Manage your farm products, orders and jobs
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* STAT CARDS */}

      <Grid container spacing={3}>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="My Products"
            value={counts.products}
            icon={<AgricultureIcon />}
            color="#2e7d32"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Orders Received"
            value={counts.orders}
            icon={<ShoppingCartIcon />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Job Posts"
            value={counts.jobs}
            icon={<WorkIcon />}
            color="#ed6c02"
            loading={loading}
          />
        </Grid>

      </Grid>


      {/* CHART SECTION (LIKE YOUR DESIGN) */}

      <Grid container sx={{ mt: 9 }} justifyContent="center">

        <Grid item xs={12} md={10}>

          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              height: 450,
              border: "2px solid #e0e0e0",
              mx: "auto",
              width: "100%"
            }}
          >

            <Typography
              variant="h6"
              fontWeight="600"
              textAlign="center"
              mb={3}
            >
              Products vs Orders vs Jobs
            </Typography>

            <ResponsiveContainer width="100%" height="85%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={150}
                  innerRadius={70}
                  label
                >

                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Pie>

                <Tooltip />

                <Legend verticalAlign="bottom" />

              </PieChart>

            </ResponsiveContainer>

          </Paper>

        </Grid>

      </Grid>


      {/* QUICK ACTIONS */}

      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3
        }}
      >

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Quick Actions
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

          <Button
            variant="contained"
            onClick={() => navigate("/farmer/products")}
          >
            Add Product
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/farmer/orders")}
          >
            View Orders
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/farmer/jobs")}
          >
            Post Job
          </Button>

        </Stack>

      </Paper>


      {/* FOOTER */}

      <Paper
        sx={{
          mt: 4,
          p: 2,
          textAlign: "center",
          bgcolor: "#f8f9fa",
          borderRadius: 2
        }}
      >

        <Typography variant="body2" color="text.secondary">
          Connected to <b>Market Mitra Database</b>
        </Typography>

      </Paper>

    </Container>
  );
};

export default FarmerDashboard;
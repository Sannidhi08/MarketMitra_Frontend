import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ArticleIcon from "@mui/icons-material/Article";

import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

/* ---------------- Stat Card ---------------- */

const StatCard = ({ title, value, icon, color, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      border: "1px solid #e0e0e0",
      borderRadius: 2
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          p: 1.5,
          backgroundColor: `${color}15`,
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
          <CircularProgress size={20} sx={{ mt: 1 }} />
        ) : (
          <Typography variant="h5" fontWeight="700">
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

/* ---------------- Dashboard ---------------- */

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    farmers: 0,
    users: 0,
    articles: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.get(
        "http://localhost:3003/api/admin/dashboard-stats",
        {
          headers: {
            "x-user-id": userId
          }
        }
      );

      if (response.data.success) {
        setCounts({
          farmers: Number(response.data.farmers) || 0,
          users: Number(response.data.users) || 0,
          articles: Number(response.data.articles) || 0
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch database stats";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* -------- Chart Data -------- */

  const pieData = [
    { name: "Farmers", value: counts.farmers },
    { name: "Customers", value: counts.users }
  ];

  const COLORS = ["#2e7d32", "#1976d2"];

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto" }}>

      {/* HEADER */}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="success.main">
          Market Mitra Insights
        </Typography>

        <Typography color="text.secondary">
          Real-time overview of farmers and customers
        </Typography>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* STAT CARDS */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Farmers Registered"
            value={counts.farmers}
            icon={<AgricultureIcon />}
            color="#2e7d32"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Customers"
            value={counts.users}
            icon={<PeopleIcon />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Articles"
            value={counts.articles}
            icon={<ArticleIcon />}
            color="#ed6c02"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* PIE CHART - WIDER & CENTERED */}

      <Grid container sx={{ mt: 5 }} justifyContent="center">

        <Grid item xs={12} md={10}> {/* Widened from 8 to 10 */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              height: 450, // Slightly taller to maintain aspect ratio
              border: "1px solid #e0e0e0",
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
              Users vs Farmers Distribution
            </Typography>

            <ResponsiveContainer width="100%" height="85%">
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={150} // Increased radius for the wider box
                  innerRadius={70}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </Paper>
        </Grid>

      </Grid>

      {/* FOOTER */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
          bgcolor: "#f8f9fa",
          borderRadius: 2,
          border: "1px dashed #ccc"
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Connected to <b>Market Mitra Database</b> via Port 3003
        </Typography>
      </Paper>

    </Box>
  );
};

export default AdminDashboard;
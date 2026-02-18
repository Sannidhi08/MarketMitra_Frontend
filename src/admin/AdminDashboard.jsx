import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper, Box, Stack, CircularProgress, Alert } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ArticleIcon from '@mui/icons-material/Article';
import axios from "axios";

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, loading }) => (
  <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ p: 1.5, backgroundColor: `${color}15`, borderRadius: 2, color: color }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="500">
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={20} sx={{ mt: 1, color: color }} />
        ) : (
          <Typography variant="h5" fontWeight="700">
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ farmers: 0, users: 0, articles: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching
        
        // 1. Get the ID stored during login
        const userId = localStorage.getItem("userId"); 

        if (!userId) {
          setError("Admin ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // 2. Fetch from your Node.js server
        const response = await axios.get("http://localhost:3003/api/admin/dashboard-stats", {
          headers: {
            "x-user-id": userId // Required by your adminMiddleware
          }
        });

        // 3. Update state with numbers (ensures string values from SQL are converted)
        if (response.data.success) {
          setCounts({
            farmers: Number(response.data.farmers) || 0,
            users: Number(response.data.users) || 0,
            articles: Number(response.data.articles) || 0
          });
        }
      } catch (err) {
        // Handle specific error messages from the backend
        const errorMsg = err.response?.data?.message || "Failed to fetch database stats";
        setError(errorMsg);
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="success.main">
          Market Mitra Insights
        </Typography>
        <Typography color="text.secondary">
          Real-time overview of farmers and customers.
        </Typography>
      </Box>

      {/* Show Error Alert if fetch fails */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Farmers Registered" 
            value={counts.farmers} 
            icon={<AgricultureIcon />} 
            color="#2e7d32" 
            loading={loading} 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Active Customers" 
            value={counts.users} 
            icon={<PeopleIcon />} 
            color="#1976d2" 
            loading={loading} 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard 
            title="Total Articles" 
            value={counts.articles} 
            icon={<ArticleIcon />} 
            color="#ed6c02" 
            loading={loading} 
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px dashed #ccc' }}>
         <Typography variant="body2" color="text.secondary" textAlign="center">
           Connected to <b>Market Mitra Database</b> via Port 3003.
         </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
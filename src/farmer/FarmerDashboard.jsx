import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

const FarmerDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Farmer Dashboard 🌾
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Manage your products, orders, and job posts in one place
        </Typography>
      </Paper>

      {/* Info Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Welcome Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: "#2e7d32" }}>F</Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Welcome Back!
                </Typography>
                <Typography color="text.secondary">
                  Have a productive day 🌱
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Keep your product listings updated to get better visibility
              and faster orders.
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Products
                </Typography>
                <Typography color="text.secondary">
                  Add & manage your products
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Orders
                </Typography>
                <Typography color="text.secondary">
                  Track customer orders
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Jobs
                </Typography>
                <Typography color="text.secondary">
                  Post & manage farm jobs
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>

        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => navigate("/farmer/products")}
        >
          ADD PRODUCT
        </Button>

        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => navigate("/farmer/orders")}
        >
          VIEW ORDERS
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/farmer/jobs")}
        >
          POST JOB
        </Button>
      </Paper>

      {/* Tips Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Tips for Farmers 🌿
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          • Add clear product images to attract more buyers  
        </Typography>
        <Typography variant="body2">
          • Keep prices updated based on market demand  
        </Typography>
        <Typography variant="body2">
          • Respond quickly to orders for better ratings  
        </Typography>
      </Paper>
    </Box>
  );
};

export default FarmerDashboard;
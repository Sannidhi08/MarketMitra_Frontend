import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel
} from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";

const API = "http://localhost:3003/orders";

const ViewOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const farmerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const loadOrders = async () => {

      try {

        if (!farmerId) return;

        const res = await axios.get(`${API}/farmer/${farmerId}`);

        const fixedOrders = (res.data.orders || []).map(o => ({
          ...o,
          status: o.status || "pending"
        }));

        setOrders(fixedOrders);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    loadOrders();
  }, [farmerId]);


  const updateStatus = async (orderId, status) => {

    try {

      await axios.put(`${API}/${orderId}/status`, { status });

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status } : o
        )
      );

    } catch (err) {
      console.error(err);
    }

  };


  const getStatusColor = (status) => {
    if (status === "approved") return "success";
    return "warning";
  };


  const pendingCount = orders.filter(o => o.status === "pending").length;
  const approvedCount = orders.filter(o => o.status === "approved").length;


  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(o => o.status === filter);


  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress color="success" />
      </Box>
    );


  if (!orders.length)
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary">
          No orders received yet 🌱
        </Typography>
      </Box>
    );


  return (

    <Box sx={{ p: 3, background: "#f4f8f5", minHeight: "100vh" }}>

      {/* HEADER */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "#1b5e20" }}
        >
          📦 Orders Received
        </Typography>

        <FormControl size="small">

          <InputLabel>Sort By</InputLabel>

          <Select
            value={filter}
            label="Sort By"
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >

            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>

          </Select>

        </FormControl>

      </Stack>


      {/* SUMMARY CARDS */}

      <Grid container spacing={2} mb={3}>

        <Grid item xs={12} md={6}>

          <Paper sx={{ p: 2, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <PendingActionsIcon sx={{ color: "#ed6c02" }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {pendingCount}
                </Typography>
              </Box>
            </Stack>

            <Chip label="Pending" color="warning" size="small" />

          </Paper>

        </Grid>


        <Grid item xs={12} md={6}>

          <Paper sx={{ p: 2, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <CheckCircleIcon sx={{ color: "#2e7d32" }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Approved
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {approvedCount}
                </Typography>
              </Box>
            </Stack>

            <Chip label="Approved" color="success" size="small" />

          </Paper>

        </Grid>

      </Grid>


      {/* ORDERS */}

      {filteredOrders.map((order) => {

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
              p: 2,
              mb: 2,
              borderRadius: 2,
              borderLeft: "5px solid #2e7d32",
              transition: "0.2s",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }
            }}
          >

            {/* HEADER */}

            <Stack direction="row" justifyContent="space-between" alignItems="center">

              <Stack direction="row" spacing={1} alignItems="center">
                <ShoppingCartIcon fontSize="small" sx={{ color: "#2e7d32" }} />
                <Typography fontWeight={600}>
                  Order #{order.id}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>

                <Chip label={order.payment_method} color="primary" size="small" />

                <Chip
                  label={order.status.toUpperCase()}
                  color={getStatusColor(order.status)}
                  size="small"
                />

              </Stack>

            </Stack>


            <Typography variant="caption" color="text.secondary">
              {new Date(order.created_at).toLocaleString()}
            </Typography>


            <Divider sx={{ my: 1.5 }} />


            {/* BUYER */}

            <Typography fontWeight={600} color="#2e7d32" variant="body2">
              Buyer
            </Typography>

            <Typography variant="body2">
              {order.user_name} ({order.user_email})
            </Typography>


            <Divider sx={{ my: 1.5 }} />


            {/* ITEMS */}

            <Typography fontWeight={600} color="#2e7d32" mb={1} variant="body2">
              Items
            </Typography>

            <Stack spacing={1}>

              {order.items.map((item) => (

                <Paper
                  key={item.id}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#fafafa"
                  }}
                >

                  <Typography variant="body2">
                    {item.product_name} × {item.quantity}
                  </Typography>

                  <Typography variant="body2" fontWeight={600}>
                    ₹{item.price * item.quantity}
                  </Typography>

                </Paper>

              ))}

            </Stack>


            <Divider sx={{ my: 1.5 }} />


            {/* TOTAL */}

            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >

              <Typography fontWeight={600}>
                ₹{order.total_amount}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">

                <LocationOnIcon sx={{ fontSize: 16 }} />

                <Typography variant="caption" sx={{ maxWidth: 400 }}>
                  {address}
                </Typography>

              </Stack>

            </Stack>


            <Divider sx={{ my: 1.5 }} />


            {/* STATUS */}

            <Select
              size="small"
              value={order.status}
              onChange={(e) =>
                updateStatus(order.id, e.target.value)
              }
            >

              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>

            </Select>

          </Paper>

        );

      })}

    </Box>

  );

};

export default ViewOrders;
import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  IconButton
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import axios from "axios";
import jsPDF from "jspdf";

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


  /* ---------- DOWNLOAD ORDER PDF ---------- */

  const downloadOrder = (order) => {

    const doc = new jsPDF();

    let y = 20;

    /* ---------- HEADER ---------- */

    doc.setFontSize(22);
    doc.text("MarketMitra", 20, y);

    y += 8;

    doc.setFontSize(14);
    doc.text("Order Invoice", 20, y);

    y += 12;

    doc.setFontSize(11);

    doc.text(`Order ID : ${order.id}`, 20, y);
    doc.text(
      `Date : ${new Date(order.created_at).toLocaleString()}`,
      120,
      y
    );

    y += 10;

    doc.line(20, y, 190, y);

    y += 12;

    /* ---------- TABLE HEADER ---------- */

    doc.setFontSize(12);

    doc.text("Product", 20, y);
    doc.text("Qty", 110, y);
    doc.text("Price", 140, y);
    doc.text("Total", 170, y);

    y += 3;

    doc.line(20, y, 190, y);

    y += 8;

    /* ---------- ITEMS ---------- */

    order.items.forEach((item) => {

      const total = item.price * item.quantity;

      doc.text(item.product_name, 20, y);
      doc.text(String(item.quantity), 110, y);
      doc.text(`Rs ${item.price}`, 140, y);
      doc.text(`Rs ${total}`, 170, y);

      y += 8;

      doc.line(20, y - 3, 190, y - 3);

    });

    y += 10;

    /* ---------- TOTAL SECTION ---------- */

    doc.setFontSize(14);

    doc.text(`Grand Total : Rs ${order.total_amount}`, 20, y);

    y += 15;

    doc.line(20, y - 5, 190, y - 5);

    /* ---------- FOOTER ---------- */

    doc.setFontSize(10);

    doc.text(
      "Thank you for shopping with MarketMitra!",
      20,
      y + 5
    );

    doc.save(`order_${order.id}.pdf`);
  };


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
            backgroundColor: "#f9fafc"
          }}
        >

          {/* ORDER HEADER */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Typography fontWeight="bold">
              Order #{order.id}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">

              <Chip
                label="Completed"
                color="success"
                size="small"
              />

              {/* DOWNLOAD BUTTON */}

              <IconButton
                color="primary"
                onClick={() => downloadOrder(order)}
              >
                <DownloadIcon />
              </IconButton>

            </Stack>

          </Stack>

          <Typography variant="body2" mt={1}>
            {new Date(order.created_at).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* ORDER ITEMS */}

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
                Rs {item.price * item.quantity}
              </Typography>

            </Stack>

          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" textAlign="right">
            Total: Rs {order.total_amount}
          </Typography>

        </Paper>

      ))}

    </Box>

  );
};

export default Orders;
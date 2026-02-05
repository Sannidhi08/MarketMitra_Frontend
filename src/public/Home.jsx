import React from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>


      {/* HERO CONTENT */}
      <Paper sx={{ p: 4, textAlign: "center", mt: 6 }}>
        <Typography variant="h3" gutterBottom>
          Market Mitra
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Farmers sell directly to customers
        </Typography>

        <Box>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => navigate("/products")}
          >
            Browse Products
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default Home;

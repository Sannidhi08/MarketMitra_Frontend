import React from "react";
import { Typography, Paper, Button } from "@mui/material";

const BrowseProducts = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Browse Products
      </Typography>

      <Typography>
        Products from farmers will be displayed here.
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }}>
        Add to Cart
      </Button>
    </Paper>
  );
};

export default BrowseProducts;

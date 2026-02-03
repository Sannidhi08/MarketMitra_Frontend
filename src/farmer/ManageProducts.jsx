import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

const ManageProducts = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = () => {
    alert(`Product Added: ${productName}`);
    setProductName("");
    setPrice("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Products
      </Typography>

      <TextField
        label="Product Name"
        fullWidth
        margin="normal"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <TextField
        label="Price"
        type="number"
        fullWidth
        margin="normal"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <Button variant="contained" onClick={handleAdd}>
        Add Product
      </Button>
    </Paper>
  );
};

export default ManageProducts;

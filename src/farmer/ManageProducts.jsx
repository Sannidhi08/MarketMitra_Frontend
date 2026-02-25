import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import axios from "axios";

const API = "http://localhost:3003";

/* ✅ MenuProps – fixes hidden / cut category text */
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 2000,
    },
  },
};

const ManageProducts = () => {
  const farmerId = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products/farmer`, {
        headers: { "x-user-id": farmerId },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (farmerId) {
      loadProducts();
      loadCategories();
    }
  }, [farmerId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= ADD PRODUCT ================= */
  const handleAdd = async () => {
    if (!form.name || !form.price || !form.quantity || !form.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("farmer_id", farmerId);
      if (image) fd.append("image", image);

      await axios.post(`${API}/products/add`, fd);

      setForm({ name: "", price: "", quantity: "", category: "" });
      setImage(null);
      setPreview(null);

      loadProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.product_name,
      price: p.price,
      quantity: p.quantity,
      category: p.category_id,
    });
    setPreview(p.image);
    setOpen(true);
  };

  const saveEdit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      await axios.put(`${API}/products/update/${editId}`, fd);

      setOpen(false);
      setImage(null);
      setPreview(null);

      loadProducts();
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <Box sx={{ p: 4, backgroundColor: "#f1f8f4", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1b5e20" }}>
        🌱 Manage Products
      </Typography>

      {/* ADD PRODUCT */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 3, borderLeft: "6px solid #2e7d32" }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32" }}>
          Add New Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Price (₹)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </Grid>

          {/* ✅ CATEGORY – FULLY VISIBLE */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              SelectProps={{
                MenuProps: menuProps,
                renderValue: (selected) => {
                  const cat = categories.find((c) => c.id === selected);
                  return cat ? cat.category_name : "";
                },
              }}
              sx={{
                "& .MuiSelect-select": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                },
              }}
            >
              {categories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {c.category_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* IMAGE */}
          <Grid item xs={12}>
            <Button component="label" sx={{ color: "#2e7d32" }}>
              Upload Image
              <input hidden type="file" onChange={(e) => handleImage(e.target.files[0])} />
            </Button>

            {preview && (
              <Box mt={1}>
                <img src={preview} alt="" style={{ height: 120, borderRadius: 8 }} />
              </Box>
            )}
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#2e7d32", px: 4 }}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* PRODUCT LIST */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} md={4} key={p.id}>
              <Paper sx={{ p: 2, borderRadius: 3, borderTop: "4px solid #43a047" }}>
                <Typography variant="h6">{p.product_name}</Typography>
                <Typography>₹ {p.price}</Typography>
                <Typography>Qty: {p.quantity}</Typography>
                <Typography sx={{ color: "#2e7d32" }}>{p.category_name}</Typography>

                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginTop: 10,
                    }}
                  />
                )}

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button size="small" onClick={() => openEdit(p)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => del(p.id)}>Delete</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#2e7d32" }}>Edit Product</DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Name" name="name" sx={{ mt: 1 }} value={form.name} onChange={handleChange} />
          <TextField fullWidth label="Price" type="number" name="price" sx={{ mt: 2 }} value={form.price} onChange={handleChange} />
          <TextField fullWidth label="Quantity" type="number" name="quantity" sx={{ mt: 2 }} value={form.quantity} onChange={handleChange} />

          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            SelectProps={{ MenuProps: menuProps }}
            sx={{ mt: 2 }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.category_name}</MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: "#2e7d32" }} onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageProducts;
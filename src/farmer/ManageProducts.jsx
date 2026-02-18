import React, { useEffect, useState } from "react";
import {
  TextField, Button, Typography, Paper, Box,
  MenuItem, Grid, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import axios from "axios";

const API = "http://localhost:3003";

const ManageProducts = () => {

  const farmerId = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: ""
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
        headers: { "x-user-id": farmerId }
      });

      setProducts(res.data.products || []);

    } catch (err) {
      console.error("Load products error:", err);
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
      console.error("Categories error:", err);
    }
  };

  useEffect(() => {
    if (farmerId) {
      loadProducts();
      loadCategories();
    }
  }, [farmerId]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= IMAGE PREVIEW ================= */
  const handleImage = file => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= ADD PRODUCT ================= */
  const handleAdd = async () => {
    if (!form.name || !form.price || !form.quantity || !form.category)
      return alert("Please fill all fields");

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, v)
      );

      fd.append("farmer_id", farmerId);

      if (image) fd.append("image", image);

      await axios.post(`${API}/products/add`, fd);

      setForm({ name: "", price: "", quantity: "", category: "" });
      setPreview(null);
      setImage(null);

      await loadProducts();

    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = p => {
    setEditId(p.id);

    setForm({
      name: p.product_name,
      price: p.price,
      quantity: p.quantity,
      category: p.category_id
    });

    setPreview(p.image);
    setOpen(true);
  };

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, v)
      );

      if (image) fd.append("image", image);

      await axios.put(`${API}/products/update/${editId}`, fd);

      setOpen(false);
      setImage(null);

      await loadProducts();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const del = async id => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/products/delete/${id}`);

      setProducts(prev => prev.filter(p => p.id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h4">Manage Products</Typography>

      {/* ADD FORM */}
      <Paper sx={{ p: 3, mt: 3 }}>

        <TextField
          fullWidth label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth label="Price"
          type="number"
          name="price"
          sx={{ mt: 2 }}
          value={form.price}
          onChange={handleChange}
        />

        <TextField
          fullWidth label="Quantity"
          type="number"
          name="quantity"
          sx={{ mt: 2 }}
          value={form.quantity}
          onChange={handleChange}
        />

        <TextField
          select fullWidth
          label="Category"
          name="category"
          sx={{ mt: 2 }}
          value={form.category}
          onChange={handleChange}
        >
          {categories.map(c => (
            <MenuItem key={c.id} value={c.id}>
              {c.category_name}
            </MenuItem>
          ))}
        </TextField>

        <Button component="label" sx={{ mt: 2 }}>
          Upload Image
          <input hidden type="file"
            onChange={e => handleImage(e.target.files[0])}
          />
        </Button>

        {preview && (
          <img src={preview} width="200" alt="" style={{ marginTop: 10 }} />
        )}

        <Button variant="contained" sx={{ mt: 3 }} onClick={handleAdd}>
          Add Product
        </Button>
      </Paper>

      {/* PRODUCT LIST */}
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {products.map(p => (
            <Grid item xs={12} md={4} key={p.id}>
              <Paper sx={{ p: 2 }}>

                <Typography variant="h6">{p.product_name}</Typography>
                <Typography>₹ {p.price}</Typography>
                <Typography>Qty {p.quantity}</Typography>
                <Typography>{p.category_name}</Typography>

                {p.image && (
                  <img src={p.image} width="100%" alt="" />
                )}

                <Button onClick={() => openEdit(p)}>Edit</Button>

                <Button color="error" onClick={() => del(p.id)}>
                  Delete
                </Button>

              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent>

          <TextField fullWidth label="Name" name="name"
            sx={{ mt: 1 }}
            value={form.name}
            onChange={handleChange}
          />

          <TextField fullWidth label="Price" type="number"
            name="price"
            sx={{ mt: 2 }}
            value={form.price}
            onChange={handleChange}
          />

          <TextField fullWidth label="Quantity" type="number"
            name="quantity"
            sx={{ mt: 2 }}
            value={form.quantity}
            onChange={handleChange}
          />

          <TextField select fullWidth label="Category"
            name="category"
            sx={{ mt: 2 }}
            value={form.category}
            onChange={handleChange}
          >
            {categories.map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.category_name}
              </MenuItem>
            ))}
          </TextField>

          <Button component="label" sx={{ mt: 2 }}>
            Change Image
            <input hidden type="file"
              onChange={e => handleImage(e.target.files[0])}
            />
          </Button>

          {preview && (
            <img src={preview} width="200" alt="" style={{ marginTop: 10 }} />
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ManageProducts;

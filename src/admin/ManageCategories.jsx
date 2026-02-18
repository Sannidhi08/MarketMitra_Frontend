import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const BASE_URL = "http://localhost:3003";
const CATEGORIES_URL = `${BASE_URL}/api/categories`;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_name: "",
    description: "",
    image: ""
  });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adminId = localStorage.getItem("userId");

  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(CATEGORIES_URL);
      setCategories(res.data.categories || []);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  /* ADD CATEGORY */
  const handleAdd = async () => {
    if (!form.category_name.trim()) {
      alert("Category name is required");
      return;
    }

    if (!adminId) {
      alert("Admin not logged in");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${CATEGORIES_URL}/add`, form, {
        headers: {
          "x-user-id": adminId
        }
      });

      setForm({ category_name: "", description: "", image: "" });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  /* OPEN EDIT */
  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      category_name: cat.category_name,
      description: cat.description,
      image: cat.image
    });
    setOpen(true);
  };

  /* SAVE EDIT */
  const saveEdit = async () => {
    if (!form.category_name.trim()) return;

    try {
      setLoading(true);

      await axios.put(
        `${CATEGORIES_URL}/update/${editId}`,
        form,
        {
          headers: {
            "x-user-id": adminId
          }
        }
      );

      setOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE CATEGORY */
  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      setLoading(true);

      await axios.delete(`${CATEGORIES_URL}/delete/${id}`, {
        headers: {
          "x-user-id": adminId
        }
      });

      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Manage Categories
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* ADD CATEGORY */}
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Category Name"
          fullWidth
          sx={{ mb: 2 }}
          value={form.category_name}
          onChange={(e) =>
            setForm({ ...form, category_name: e.target.value })
          }
        />

        <TextField
          label="Description"
          fullWidth
          sx={{ mb: 2 }}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <TextField
          label="Image URL"
          fullWidth
          sx={{ mb: 2 }}
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Add Category"}
        </Button>
      </Box>

      {/* LIST */}
      <List sx={{ mt: 4 }}>
        {categories.map((cat) => (
          <ListItem
            key={cat.id}
            divider
            secondaryAction={
              <>
                <IconButton onClick={() => openEdit(cat)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => remove(cat.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={cat.category_name}
              secondary={cat.description}
            />
          </ListItem>
        ))}
      </List>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            sx={{ mt: 1 }}
            value={form.category_name}
            onChange={(e) =>
              setForm({ ...form, category_name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            sx={{ mt: 2 }}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            fullWidth
            sx={{ mt: 2 }}
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageCategories;

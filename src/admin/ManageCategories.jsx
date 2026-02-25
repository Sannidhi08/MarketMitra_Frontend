import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  InputAdornment
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";

/* ---------------- CONFIG ---------------- */

const BASE_URL = "http://localhost:3003";
const CATEGORIES_URL = `${BASE_URL}/api/categories`;

/* ---------------- COMPONENT ---------------- */

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    category_name: "",
    description: ""
  });

  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const adminId = localStorage.getItem("userId");

  /* ---------------- FETCH ---------------- */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(CATEGORIES_URL);
      setCategories(res.data.categories || []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- ADD ---------------- */

  const handleAdd = async () => {
    if (!form.category_name.trim())
      return setError("Category name is required");

    try {
      setLoading(true);

      await axios.post(`${CATEGORIES_URL}/add`, form, {
        headers: { "x-user-id": adminId }
      });

      setForm({ category_name: "", description: "" });
      fetchCategories();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      category_name: cat.category_name,
      description: cat.description
    });
    setOpen(true);
  };

  const saveEdit = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${CATEGORIES_URL}/update/${editId}`,
        form,
        { headers: { "x-user-id": adminId } }
      );

      setOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

  const remove = async () => {
    try {
      setLoading(true);

      await axios.delete(`${CATEGORIES_URL}/delete/${deleteId}`, {
        headers: { "x-user-id": adminId }
      });

      setDeleteDialog(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- PAGINATION SLICE ---------------- */

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ---------------- UI ---------------- */

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", p: 4 }}>
      <Paper sx={{ maxWidth: 1100, mx: "auto", p: 4, borderRadius: 3 }}>

        {/* HEADER */}
        <Typography variant="h5" fontWeight={700} color="#2e7d32">
          Category Management
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Create, search and manage product categories
        </Typography>

        <Divider sx={{ my: 3 }} />

        {error && <Alert severity="error">{error}</Alert>}

        {/* ADD FORM */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: "#fafafa" }}>
          <Typography fontWeight={600} mb={2}>
            Add New Category
          </Typography>

          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Category Name"
              value={form.category_name}
              onChange={(e) =>
                setForm({ ...form, category_name: e.target.value })
              }
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={loading}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" }
              }}
            >
              {loading
                ? <CircularProgress size={20} color="inherit" />
                : "Add Category"}
            </Button>
          </Box>
        </Paper>

        {/* SEARCH */}
        <TextField
          fullWidth
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        {/* TABLE */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>

            <TableHead sx={{ background: "#eef3ef" }}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((cat) => (
                <TableRow key={cat.id} hover>

                  <TableCell sx={{ fontWeight: 600 }}>
                    {cat.category_name}
                  </TableCell>

                  <TableCell>
                    {cat.description || "—"}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(cat)}>
                      <EditIcon color="primary" />
                    </IconButton>

                    <IconButton onClick={() => confirmDelete(cat.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* EDIT MODAL */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Category</DialogTitle>

          <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Category Name"
              value={form.category_name}
              onChange={(e) =>
                setForm({ ...form, category_name: e.target.value })
              }
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
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

        {/* DELETE CONFIRMATION */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Category?</DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to delete this category?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={remove}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </Box>
  );
};

export default ManageCategories;
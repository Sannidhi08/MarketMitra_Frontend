import React, { useState, useEffect } from "react";
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
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ManageCategories = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Load categories from localStorage on mount
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(storedCategories);
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Add category
  const handleAdd = () => {
    const trimmed = category.trim();
    if (!trimmed) {
      alert("Please enter a category name.");
      return;
    }
    if (categories.includes(trimmed)) {
      alert("This category already exists.");
      return;
    }

    setCategories([...categories, trimmed]);
    setCategory("");
  };

  // Open Edit dialog
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(categories[index]);
    setOpenDialog(true);
  };

  // Save edited category
  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      alert("Category name cannot be empty.");
      return;
    }
    if (categories.includes(trimmed) && trimmed !== categories[editIndex]) {
      alert("This category already exists.");
      return;
    }

    const updated = [...categories];
    updated[editIndex] = trimmed;
    setCategories(updated);
    setOpenDialog(false);
    setEditIndex(null);
    setEditValue("");
  };

  // Delete category
  const handleDelete = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Categories
      </Typography>

      {/* Add Category */}
      <TextField
        label="Category Name"
        fullWidth
        margin="normal"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Category
      </Button>

      {/* Categories List */}
      <Typography variant="h6" gutterBottom>
        Categories List
      </Typography>
      {categories.length === 0 ? (
        <Typography>No categories added yet.</Typography>
      ) : (
        <List>
          {categories.map((cat, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(index)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={cat} />
            </ListItem>
          ))}
        </List>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageCategories;

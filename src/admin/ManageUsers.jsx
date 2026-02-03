import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("farmer");

  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Add new user
  const handleAdd = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      alert("Name and email cannot be empty.");
      return;
    }

    // Check duplicate email
    if (users.some((u) => u.email === trimmedEmail)) {
      alert("A user with this email already exists.");
      return;
    }

    const newUser = { name: trimmedName, email: trimmedEmail, role };
    setUsers([...users, newUser]);

    setName("");
    setEmail("");
    setRole("farmer");
  };

  // Open edit dialog
  const handleEdit = (index) => {
    setEditIndex(index);
    setName(users[index].name);
    setEmail(users[index].email);
    setRole(users[index].role);
    setOpenDialog(true);
  };

  // Save edited user
  const handleSaveEdit = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      alert("Name and email cannot be empty.");
      return;
    }

    // Prevent duplicate email (excluding the current user)
    if (users.some((u, i) => u.email === trimmedEmail && i !== editIndex)) {
      alert("A user with this email already exists.");
      return;
    }

    const updatedUsers = [...users];
    updatedUsers[editIndex] = { name: trimmedName, email: trimmedEmail, role };
    setUsers(updatedUsers);

    setOpenDialog(false);
    setEditIndex(null);
    setName("");
    setEmail("");
    setRole("farmer");
  };

  // Delete user
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      {/* Add User Form */}
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Role"
        select
        fullWidth
        margin="normal"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="farmer">Farmer</MenuItem>
        <MenuItem value="customer">Customer</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Add User
      </Button>

      {/* Users List */}
      <Typography variant="h6" gutterBottom>
        Users List
      </Typography>
      {users.length === 0 ? (
        <Typography>No users added yet.</Typography>
      ) : (
        <List>
          {users.map((user, index) => (
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
              <ListItemText
                primary={`${user.name} (${user.role})`}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Role"
            select
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="farmer">Farmer</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Farmer</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageUsers;

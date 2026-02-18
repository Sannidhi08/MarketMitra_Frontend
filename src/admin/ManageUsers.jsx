import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:3003/api/admin";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  // Get admin ID stored during login
  const adminId = localStorage.getItem("userId");

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      if (!adminId) {
        alert("Admin not logged in");
        setUsers([]);
        return;
      }

      const res = await axios.get(`${API_BASE}/users`, {
        headers: {
          "x-user-id": adminId,
        },
      });

      console.log("Users API response:", res.data);

      // ✅ Handle both formats:
      // 1) { users: [...] }
      // 2) [...]
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }

    } catch (err) {
      console.error("Load users error:", err);
      alert(err.response?.data?.message || "Failed to load users");
      setUsers([]); // Prevent crash
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= UPDATE USER STATUS ================= */
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/users/update/${userId}`,
        { status: newStatus },
        {
          headers: {
            "x-user-id": adminId,
          },
        }
      );

      // Update UI immediately
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u
        )
      );

    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= STATUS COLOR ================= */
  const statusColor = (status) => {
    if (status === "approved") return "success";
    if (status === "rejected") return "error";
    return "warning";
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!users || users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {user.role}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={statusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.role === "farmer" && (
                    <Select
                      size="small"
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                    >
                      <MenuItem value="pending" disabled>
                        Pending
                      </MenuItem>
                      <MenuItem value="approved">Approve</MenuItem>
                      <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ManageUsers;

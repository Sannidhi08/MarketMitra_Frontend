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
  Box,
  Divider,
  TextField,
  InputAdornment,
  TablePagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const API_BASE = "http://localhost:3003/api/admin";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        headers: { "x-user-id": adminId }
      });

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
      setUsers([]);
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
        { headers: { "x-user-id": adminId } }
      );

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

  /* ================= SEARCH FILTER ================= */
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", p: 4 }}>
      <Paper sx={{ maxWidth: 1200, mx: "auto", p: 4, borderRadius: 3 }}>

        {/* HEADER */}
        <Typography variant="h5" fontWeight={700} color="#2e7d32">
          User Management
        </Typography>

        <Typography variant="body2" color="text.secondary">
          View and manage platform users
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* SEARCH */}
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
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
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="right"><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id} hover>

                    <TableCell sx={{ fontWeight: 600 }}>
                      {user.name}
                    </TableCell>

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

                    <TableCell align="right">
                      {user.role === "farmer" && (
                        <Select
                          size="small"
                          value={user.status}
                          onChange={(e) =>
                            handleStatusChange(user.id, e.target.value)
                          }
                          sx={{ minWidth: 130 }}
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

      </Paper>
    </Box>
  );
};

export default ManageUsers;
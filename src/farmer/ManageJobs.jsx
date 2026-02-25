import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  Chip,
  InputAdornment,
} from "@mui/material";
// Icons add a professional touch
import {
  WorkOutline,
  LocationOnOutlined,
  AccountBalanceWalletOutlined,
  AddCircleOutline,
  EditOutlined,
  DeleteOutline,
} from "@mui/icons-material";

const ManageJobs = () => {
  const farmerId = localStorage.getItem("userId");
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  /* LOAD JOBS */
  const loadJobs = async () => {
    try {
      if (!farmerId) return setMsg("Login required");
      const res = await axios.get(`http://localhost:3003/jobs/farmer/${farmerId}`);
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load jobs");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  /* INPUT */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ADD JOB */
  const handlePost = async () => {
    try {
      if (!form.title) return setMsg("Title required");
      await axios.post("http://localhost:3003/jobs/add", { farmer_id: farmerId, ...form });
      setMsg("Job Posted Successfully ✅");
      setForm({ title: "", description: "", location: "", salary: "" });
      loadJobs();
    } catch {
      setMsg("Post failed ❌");
    }
  };

  /* DELETE */
  const del = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/jobs/delete/${id}`);
      loadJobs();
    } catch {
      setMsg("Delete failed");
    }
  };

  /* OPEN EDIT */
  const openEdit = (job) => {
    setEditId(job.id);
    setForm(job);
    setOpen(true);
  };

  /* SAVE EDIT */
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:3003/jobs/update/${editId}`, form);
      setOpen(false);
      loadJobs();
    } catch {
      setMsg("Update failed");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, backgroundColor: "#f4f7f5", minHeight: "100vh" }}>
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#2e7d32", mb: 1 }}>
          Job Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#666" }}>
          Create and manage employment opportunities for your farm operations.
        </Typography>
      </Box>

      {/* POST JOB FORM */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          mb: 5,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <AddCircleOutline sx={{ color: "#2e7d32" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
            Post a New Vacancy
          </Typography>
        </Box>

        {msg && (
          <Alert sx={{ mb: 3, borderRadius: 2 }} severity={msg.includes("✅") ? "success" : "info"}>
            {msg}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              placeholder="e.g. Senior Harvest Manager"
              value={form.title}
              onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><WorkOutline fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlined fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={form.salary}
              onChange={(e) => /^\d*$/.test(e.target.value) && setForm({ ...form, salary: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          disableElevation
          sx={{ mt: 3, px: 4, py: 1.2, borderRadius: 2, backgroundColor: "#2e7d32", fontWeight: 600, textTransform: "none" }}
          onClick={handlePost}
        >
          Publish Job
        </Button>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      {/* JOB LISTING SECTION */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mb: 3 }}>
        Your Active Listings
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                transition: "all 0.2s ease-in-out",
                "&:hover": { borderColor: "#2e7d32", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1b5e20" }}>
                  {job.title}
                </Typography>
                <Chip label="Active" size="small" sx={{ backgroundColor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
              </Box>

              <Typography variant="body2" sx={{ color: "#555", mb: 3, lineHeight: 1.6, minHeight: "3em" }}>
                {job.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnOutlined sx={{ fontSize: 18, color: "#888" }} />
                  <Typography variant="caption" sx={{ color: "#666", fontWeight: 500 }}>{job.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccountBalanceWalletOutlined sx={{ fontSize: 18, color: "#888" }} />
                  <Typography variant="caption" sx={{ color: "#666", fontWeight: 500 }}>₹{job.salary}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: "1px solid #f0f0f0", pt: 2 }}>
                <Button
                  size="small"
                  startIcon={<EditOutlined />}
                  sx={{ color: "#2e7d32", textTransform: "none", fontWeight: 600 }}
                  onClick={() => openEdit(job)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteOutline />}
                  color="error"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={() => del(job.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: "#2e7d32" }}>Update Job Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Job Title" name="title" value={form.title} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Location" name="location" value={form.location} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Salary" name="salary" value={form.salary} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#666", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" disableElevation sx={{ backgroundColor: "#2e7d32", borderRadius: 2, px: 3, textTransform: "none" }} onClick={saveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageJobs;
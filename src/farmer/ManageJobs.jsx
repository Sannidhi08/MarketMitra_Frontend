import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

const ManageJobs = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = () => {
    alert("Job Posted Successfully");
    setJobTitle("");
    setDescription("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Job Posts
      </Typography>

      <TextField
        label="Job Title"
        fullWidth
        margin="normal"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
      />

      <TextField
        label="Job Description"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button variant="contained" onClick={handlePost}>
        Post Job
      </Button>
    </Paper>
  );
};

export default ManageJobs;

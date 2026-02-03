import React from "react";
import { Typography, Paper, Button } from "@mui/material";

const ViewJobs = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Job Posts
      </Typography>

      <Typography>
        Job opportunities posted by farmers.
      </Typography>

      <Button variant="outlined" sx={{ mt: 2 }}>
        Contact Farmer
      </Button>
    </Paper>
  );
};

export default ViewJobs;

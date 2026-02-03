import React from "react";
import { Typography, Paper } from "@mui/material";

const ViewArticles = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Articles
      </Typography>
      <Typography>
        Read articles posted by admin.
      </Typography>
    </Paper>
  );
};

export default ViewArticles;

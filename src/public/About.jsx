import React from "react";
import { Typography, Paper } from "@mui/material";

const About = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        About Market Mitra
      </Typography>

      <Typography>
        Market Mitra connects farmers directly with customers,
        ensuring fair prices, fresh produce, and transparent trade.
      </Typography>
    </Paper>
  );
};

export default About;

import React from "react";
import { Typography, Paper, TextField, Button } from "@mui/material";

const Contact = () => {
  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>

      <TextField
        label="Name"
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        fullWidth
        margin="normal"
      />

      <TextField
        label="Message"
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />

      <Button variant="contained" sx={{ mt: 2 }}>
        Send Message
      </Button>
    </Paper>
  );
};

export default Contact;

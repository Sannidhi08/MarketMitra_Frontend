import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Container, Box } from "@mui/material";

const PublicLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Full screen height
      }}
    >
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default PublicLayout;
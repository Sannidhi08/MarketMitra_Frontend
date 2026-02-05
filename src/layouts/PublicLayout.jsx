import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import { Container } from "@mui/material";

const PublicLayout = () => {
  return (
    <>
      <PublicHeader />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default PublicLayout;

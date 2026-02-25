import React from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Container,
  Stack,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#ffffff" }}>

      {/* ================= HERO SECTION ================= */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >

          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#111827",
                mb: 3
              }}
            >
              Fresh From Farmers.
              <br />
              Direct To Your Home.
            </Typography>

            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#6b7280",
                mb: 4,
                maxWidth: 520
              }}
            >
              Market Mitra connects farmers directly with customers,
              ensuring fresh produce, fair pricing, and transparent trade —
              without middlemen.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: "#166534",
                  "&:hover": { backgroundColor: "#14532d" }
                }}
                onClick={() => navigate("/products")}
              >
                Browse Products
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: "#166534",
                  color: "#166534",
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    borderColor: "#14532d"
                  }
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Stack>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" }
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
              alt="Fresh Farm Produce"
              sx={{
                width: { xs: "100%", md: "90%" },
                maxWidth: 520,
                borderRadius: 4,
                boxShadow: "0 35px 70px rgba(0,0,0,0.18)",
                objectFit: "cover"
              }}
            />
          </Grid>

        </Grid>
      </Container>

      {/* ================= TRUST SECTION ================= */}
      <Box sx={{ backgroundColor: "#f9fafb", py: 12 }}>
        <Container maxWidth="lg">

          <Typography
            textAlign="center"
            sx={{
              fontSize: "1.9rem",
              fontWeight: 700,
              mb: 7,
              color: "#111827"
            }}
          >
            Why Market Mitra?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: "Direct Farmer Access",
                desc: "Buy directly from verified farmers without intermediaries."
              },
              {
                title: "Fresh & Quality Produce",
                desc: "Farm-fresh vegetables, fruits and products delivered faster."
              },
              {
                title: "Fair & Transparent Pricing",
                desc: "Better income for farmers and better value for customers."
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    height: "100%",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
                      transform: "translateY(-8px)"
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      mb: 2,
                      color: "#166534"
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography sx={{ color: "#6b7280" }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>

      {/* ================= CALL TO ACTION ================= */}
      <Box sx={{ py: 14, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              fontSize: "2.1rem",
              fontWeight: 700,
              mb: 3,
              color: "#111827"
            }}
          >
            Support Farmers. Shop Smarter.
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",
              mb: 5,
              fontSize: "1.05rem"
            }}
          >
            Join Market Mitra today and experience a better way to buy fresh produce.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.7,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: "#166534",
              "&:hover": { backgroundColor: "#14532d" }
            }}
            onClick={() => navigate("/products")}
          >
            Explore Marketplace
          </Button>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
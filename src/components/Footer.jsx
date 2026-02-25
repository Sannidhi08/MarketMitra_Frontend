import React from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Link,
  Divider
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
        color: "#ffffff",
        mt: 8,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Market Mitra
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.8 }}>
              Connecting farmers directly with customers. 
              Empowering agriculture with transparency, 
              trust, and better profits.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Quick Links
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                Home
              </Link>
              <Link href="/products" underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                Products
              </Link>
              <Link href="/about" underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                About Us
              </Link>
              <Link href="/contact" underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                Contact
              </Link>
              <Link href="/login" underline="none" color="inherit" sx={{ opacity: 0.85 }}>
                Login
              </Link>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Contact Us
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              📍 India
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              📧 support@marketmitra.com
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              📞 +91 98765 43210
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Bottom Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ opacity: 0.8 }}
        >
          © 2026 Market Mitra. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
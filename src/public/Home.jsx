import React from "react";
import {
  Button, Typography, Box, Container, Stack, Paper, Grid, Avatar, Chip
} from "@mui/material";
import { 
  ShoppingBasket, KeyboardArrowDown, LocalShipping, 
  Security, Payments, Diversity3 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", overflowX: "hidden" }}>
      
      {/* ================= 1. ORIGINAL HERO SECTION ================= */}
      <Box sx={{ position: 'relative', width: '100%', height: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000')`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip label="🌱 Direct from 1,200+ local farms" sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', px: 1 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "5.5rem" }, fontWeight: 900, lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              Eat Fresh. <br /><span style={{ color: '#4ade80' }}>Live Sustainable.</span>
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.4rem" }, maxWidth: 700, opacity: 0.9 }}>
              Market Mitra is the digital bridge between your kitchen and the local harvest. Get farm-fresh produce delivered to your place from farmers directly.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ pt: 2 }}>
              <Button variant="contained" size="large" startIcon={<ShoppingBasket />} onClick={() => navigate("/products")} sx={{ bgcolor: '#166534', px: 6, py: 2, borderRadius: 50, fontWeight: 700, fontSize: '1.1rem' }}>Browse Marketplace</Button>
              <Button variant="outlined" startIcon={<Avatar />} onClick={() => navigate("/login")} sx={{ color: '#fff', borderColor: '#fff', px: 5, py: 2, borderRadius: 50, fontWeight: 600, borderWidth: '2px' }}>Login to Account</Button>
            </Stack>
          </Stack>
        </Container>
        {/* --- WAVE SVG DIVIDER --- */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', lineHeight: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,32.41,40,92.35,50,152.29,60,263.39,67.23,321.39,56.44Z" fill="#f0fdf4"></path>
          </svg>
        </Box>
      </Box>

      {/* ================= 2. QUICK STATS ================= */}
      <Box sx={{ py: 12, bgcolor: '#f0fdf4', width: '100%' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-around" alignItems="center" spacing={6}>
            {[{ label: 'Fresh Arrivals', val: '500+' }, { label: 'Active Farmers', val: '1.2k' }, { label: 'Happy Families', val: '15k+' }].map((stat, i) => (
              <Box key={i} textAlign="center">
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#166534', mb: 1 }}>{stat.val}</Typography>
                <Typography variant="h6" sx={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>{stat.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ================= 4. WHAT IS MARKET MITRA (Larger & More Prominent) ================= */}
<Box sx={{ py: 16, bgcolor: '#ffffff', textAlign: 'center' }}>
  <Container maxWidth="md">
    <Typography variant="h3" sx={{ fontWeight: 900, color: '#166534', mb: 4 }}>
      What is Market Mitra?
    </Typography>
    <Typography variant="h6" sx={{ color: '#4b5563', fontSize: '1.3rem', lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}>
      Market Mitra is a direct-to-consumer marketplace. We remove retail layers so farmers get paid what they deserve, and you receive harvests that haven't spent weeks in cold storage.
    </Typography>
  </Container>
</Box>

{/* ================= 5. JOIN OUR COMMUNITY (Dual Section) ================= */}
<Box sx={{ py: 16, bgcolor: '#f9fafb', textAlign: 'center' }}>
  <Container maxWidth="lg">
    <Typography variant="h3" sx={{ fontWeight: 900, mb: 8 }}>
      Join Our Community
    </Typography>
    
    <Grid container spacing={6} justifyContent="center">
      {/* Farmer Card */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 8, borderRadius: 6, border: '2px solid #166534', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>For Farmers 👨‍🌾</Typography>
          <Typography variant="h6" sx={{ color: '#6b7280', mb: 5 }}>
            Register your farm and sell your harvest directly to local families.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: '#166534', py: 2, px: 6, fontSize: '1.1rem', borderRadius: 50 }}>
            REGISTER AS FARMER
          </Button>
        </Paper>
      </Grid>

      {/* User Card */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 8, borderRadius: 6, border: '2px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>For Customers 🛒</Typography>
          <Typography variant="h6" sx={{ color: '#6b7280', mb: 5 }}>
            Sign up to buy farm-fresh produce directly from the source.
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/login")} sx={{ color: '#166534', borderColor: '#166534', py: 2, px: 6, fontSize: '1.1rem', borderRadius: 50 }}>
            SIGN UP AS CUSTOMER
          </Button>
        </Paper>
      </Grid>
    </Grid>
  </Container>
</Box>
    </Box>
  );
};

export default Home;
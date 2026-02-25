import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Card, CardContent, CardMedia,
  Typography, Button, Chip, Stack,
  TextField, Select, MenuItem, Container, 
  InputAdornment, FormControl
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';

const API = "http://localhost:3003";

const PublicProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const normalize = data => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    return [];
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API}/products/public`);
      setProducts(normalize(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
      setCategories(["All", ...data.map(c => c.category_name)]);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = product => {
    const key = token ? `cart_${userId}` : "guest_cart";
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const found = existing.find(i => i.id === product.id);

    let updated = found 
      ? existing.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      : [...existing, { ...product, qty: 1 }];

    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedProductId(product.id);

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/products");
      navigate("/login");
    }
  };

  let filtered = (products || []).filter(p =>
    (category === "All" || p.category_name === category) &&
    (p.product_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f8e9", pb: 8 }}>
      {/* Top Banner Area */}
      <Box sx={{ bgcolor: "#dcedc8", py: 6, borderBottom: "1px solid #c5e1a5", mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ color: "#1b5e20", fontWeight: 800, mb: 1 }}>
            Fresh Market
          </Typography>
          <Typography variant="body1" sx={{ color: "#558b2f", fontWeight: 500 }}>
            Browse and buy fresh produce directly from local farms.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Modern Filter Toolbar */}
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={2} 
          sx={{ mb: 4, bgcolor: "#fff", p: 1.5, borderRadius: 3, border: "1px solid #c5e1a5" }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search produce..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ ml: 1, color: "#2e7d32" }} />
                </InputAdornment>
              ),
              sx: { height: 40 }
            }}
            sx={{ px: 2 }}
          />
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={sort}
                displayEmpty
                onChange={e => setSort(e.target.value)}
                IconComponent={FilterListIcon}
                sx={{ borderRadius: 2, bgcolor: "#f1f8e9", border: "none" }}
              >
                <MenuItem value="">Sort: Default</MenuItem>
                <MenuItem value="low">Price: Low to High</MenuItem>
                <MenuItem value="high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {/* Categories Section */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 5 }}>
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setCategory(cat)}
              sx={{
                px: 1,
                fontSize: "0.9rem",
                fontWeight: 600,
                bgcolor: category === cat ? "#2e7d32" : "#fff",
                color: category === cat ? "#fff" : "#2e7d32",
                border: "1px solid #c5e1a5",
                "&:hover": { bgcolor: category === cat ? "#1b5e20" : "#dcedc8" }
              }}
            />
          ))}
        </Stack>

        {/* Product Catalogue Grid */}
        <Grid container spacing={3}>
          {filtered.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 4, 
                  bgcolor: "#fff", 
                  border: "1px solid #c5e1a5",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Box sx={{ p: 1 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={p.image || "https://via.placeholder.com/300"}
                    sx={{ borderRadius: 3, objectFit: "cover" }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                  <Typography variant="caption" sx={{ color: "#689f38", fontWeight: 700, textTransform: "uppercase" }}>
                    {p.category_name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#1b5e20", fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                    {p.product_name}
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#2e7d32", fontWeight: 800 }}>
                    ₹{p.price}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disableElevation
                    startIcon={addedProductId === p.id ? null : <ShoppingBagOutlinedIcon />}
                    onClick={() => addedProductId === p.id ? navigate("/user/cart") : addToCart(p)}
                    sx={{ 
                      borderRadius: 2.5, 
                      py: 1.2,
                      textTransform: "none",
                      fontWeight: 700,
                      bgcolor: addedProductId === p.id ? "#388e3c" : "#2e7d32",
                      "&:hover": { bgcolor: "#1b5e20" }
                    }}
                  >
                    {addedProductId === p.id ? "View in Cart" : "Add to Cart"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h6" sx={{ color: "#558b2f" }}>
              No produce found matching your search.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PublicProducts;
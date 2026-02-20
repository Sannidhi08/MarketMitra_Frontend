import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Card, CardContent, CardMedia,
  Typography, Button, Chip, Stack,
  TextField, Select, MenuItem
} from "@mui/material";

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
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.categories || [];

      setCategories(["All", ...data.map(c => c.category_name)]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ADD TO CART */
  const addToCart = product => {
    const key = token ? `cart_${userId}` : "guest_cart";
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    const found = existing.find(i => i.id === product.id);

    let updated;

    if (found) {
      updated = existing.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...existing, { ...product, qty: 1 }];
    }

    localStorage.setItem(key, JSON.stringify(updated));

    /* 🔥 notify navbar instantly */
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedProductId(product.id);

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/products");
      navigate("/login");
    }
  };

  let filtered = (products || []).filter(p =>
    (category === "All" || p.category_name === category) &&
    (p.product_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Products
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search products"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Select value={sort} displayEmpty onChange={e => setSort(e.target.value)}>
          <MenuItem value="">Sort by Price</MenuItem>
          <MenuItem value="low">Low → High</MenuItem>
          <MenuItem value="high">High → Low</MenuItem>
        </Select>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {categories.map(cat => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={category === cat ? "primary" : "default"}
            onClick={() => setCategory(cat)}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filtered.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={p.image || "https://via.placeholder.com/300"}
              />

              <CardContent>
                <Typography variant="h6">{p.product_name}</Typography>
                <Typography>₹ {p.price}</Typography>

                {addedProductId === p.id ? (
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/user/cart")}
                  >
                    Go To Cart
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Typography textAlign="center" mt={5}>
          No products found
        </Typography>
      )}
    </Box>
  );
};

export default PublicProducts;

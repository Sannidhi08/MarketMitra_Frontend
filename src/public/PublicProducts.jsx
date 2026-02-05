import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  Select,
  MenuItem
} from "@mui/material";

/* ------------------ DATA ------------------ */

const categories = ["All", "Vegetables", "Fruits", "Grains"];

const productsData = [
  {
    id: 1,
    name: "Fresh Tomato",
    price: 30,
    quantity: "1 Kg",
    category: "Vegetables",
    description: "Fresh organic tomatoes",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
  },
  {
    id: 2,
    name: "Potato",
    price: 25,
    quantity: "1 Kg",
    category: "Vegetables",
    description: "Healthy farm potatoes",
    image: "https://images.unsplash.com/photo-1582515073490-dc84f45b6e4b"
  },
  {
    id: 3,
    name: "Apple",
    price: 120,
    quantity: "1 Kg",
    category: "Fruits",
    description: "Sweet red apples",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
  }
];

const PublicProducts = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCart(savedCart);
    }
  }, [userId]);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
  };

  const addToCart = (product) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (exists) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }

    saveCart(updatedCart);
    navigate("/cart"); // optional: auto open cart
  };

  let filteredProducts = productsData.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") filteredProducts.sort((a, b) => b.price - a.price);

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
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={sort}
          displayEmpty
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="">Sort by Price</MenuItem>
          <MenuItem value="low">Low to High</MenuItem>
          <MenuItem value="high">High to Low</MenuItem>
        </Select>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {categories.map((cat) => (
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
        {filteredProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardMedia component="img" height="160" image={p.image} />
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography>₹{p.price}</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PublicProducts;

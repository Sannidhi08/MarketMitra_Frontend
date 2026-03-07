import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Skeleton,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3003/api/articles/public";
const IMAGE_URL = "http://localhost:3003/uploads/articles/";

const PublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(API_URL);
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const SkeletonCard = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Skeleton width="60%" height={32} />
      <Skeleton width="30%" />
      <Divider sx={{ my: 2 }} />
      <Skeleton />
      <Skeleton />
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 800, color: "#2e7d32" }}
      >
        Latest Updates & Articles
      </Typography>

      <Grid container spacing={3}>
        {loading &&
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SkeletonCard />
            </Grid>
          ))}

        {!loading &&
          articles.map((article) => (
            <Grid item xs={12} md={6} key={article.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* IMAGE */}
                {article.image && (
                  <Box
                    component="img"
                    src={`${IMAGE_URL}${article.image}`}
                    alt={article.title}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  />
                )}

                {/* TITLE */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1b5e20" }}
                >
                  {article.title}
                </Typography>

                {/* DATE */}
                <Typography variant="caption" color="text.secondary">
                  {new Date(article.created_at).toLocaleDateString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* CONTENT */}
                <Typography sx={{ lineHeight: 1.7 }}>
                  {article.content}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default PublicArticles;
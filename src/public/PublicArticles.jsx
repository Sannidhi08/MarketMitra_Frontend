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

  /* ---------- Skeleton Card ---------- */
  const SkeletonCard = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
      }}
    >
      <Skeleton width="60%" height={32} />
      <Skeleton width="30%" />
      <Divider sx={{ my: 2 }} />
      <Skeleton />
      <Skeleton />
      <Skeleton width="90%" />
    </Paper>
  );

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: 4,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 800,
          color: "#2e7d32",
          letterSpacing: 0.5,
        }}
      >
        Latest Updates & Articles
      </Typography>

      <Grid container spacing={3}>
        {/* Loading State */}
        {loading &&
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SkeletonCard />
            </Grid>
          ))}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <Box sx={{ width: "100%", textAlign: "center", mt: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No articles available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please check again later
            </Typography>
          </Box>
        )}

        {/* Articles */}
        {!loading &&
          articles.map((article) => (
            <Grid item xs={12} md={6} key={article.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  transition: "all 0.25s ease",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1b5e20" }}
                >
                  {article.title}
                </Typography>

                {/* Date */}
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280" }}
                >
                  {new Date(article.created_at).toLocaleDateString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Content */}
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    color: "#333",
                  }}
                >
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
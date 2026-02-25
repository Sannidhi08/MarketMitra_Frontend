import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";

const ViewArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/articles");
      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f1f8f4", minHeight: "100vh" }}>
      {/* PAGE HEADER */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "#1b5e20" }}
        gutterBottom
      >
        📰 Admin Articles
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Official updates, announcements, and guidance shared by the admin.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* LOADING */}
      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress color="success" />
        </Box>
      ) : articles.length === 0 ? (
        /* EMPTY */
        <Typography textAlign="center" color="text.secondary">
          No articles available at the moment 🌱
        </Typography>
      ) : (
        /* ARTICLES */
        articles.map((article) => (
          <Paper
            key={article.id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              borderLeft: "6px solid #2e7d32",
            }}
          >
            {/* TITLE */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1b5e20" }}
            >
              {article.title}
            </Typography>

            {/* DATE */}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Published on{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* CONTENT */}
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.7,
              }}
            >
              {article.content}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ViewArticles;
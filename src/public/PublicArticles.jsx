import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest Updates & Articles
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : articles.length === 0 ? (
        <Typography>No articles available.</Typography>
      ) : (
        articles.map((article) => (
          <Paper
            key={article.id}
            sx={{ p: 3, mb: 3, borderRadius: 2 }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom>
              {article.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              {new Date(article.created_at).toLocaleDateString()}
            </Typography>

            <Typography variant="body1">
              {article.content}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default PublicArticles;

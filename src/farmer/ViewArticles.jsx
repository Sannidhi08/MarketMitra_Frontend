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
      const res = await axios.get(
        "http://localhost:3003/api/articles"
      );

      setArticles(res.data.articles || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Articles from Admin
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Read official articles and updates posted by the admin.
      </Typography>

      <Divider sx={{ my: 2 }} />

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : articles.length === 0 ? (
        <Typography>No articles available.</Typography>
      ) : (
        articles.map((article) => (
          <Paper
            key={article.id}
            variant="outlined"
            sx={{ p: 2, mb: 2 }}
          >
            <Typography variant="h6">
              {article.title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Published on{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              {article.content}
            </Typography>
          </Paper>
        ))
      )}
    </Paper>
  );
};

export default ViewArticles;

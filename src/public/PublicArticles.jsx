import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Skeleton,
  Button,
  Stack,
  Alert,
  Snackbar
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3003/api/articles/public";
const TRANSLATE_URL = "http://localhost:3003/api/articles/translate";
const IMAGE_URL = "http://localhost:3003/uploads/articles/";

const PublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [translatedArticles, setTranslatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  /* ================= FETCH ARTICLES ================= */

  const fetchArticles = async () => {
    try {
      const res = await axios.get(API_URL);
      setArticles(res.data.articles || []);
      setTranslatedArticles(res.data.articles || []);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setSnackbar({
        open: true,
        message: "Failed to load articles",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  /* ================= TRANSLATE TEXT ================= */

  const translateText = async (text, lang) => {
    if (!text || text.trim() === "") return text;
    
    try {
      const res = await axios.post(
        TRANSLATE_URL,
        {
          text: text,
          target: lang
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return res.data.translatedText || text;
    } catch (error) {
      console.error("Translation failed for text:", text.substring(0, 30) + "...");
      return text; // Return original text on error
    }
  };

  /* ================= CHANGE LANGUAGE ================= */

  const changeLanguage = async (lang) => {
    if (lang === language) return; // Skip if same language
    
    setLanguage(lang);
    setTranslating(true);

    // If switching back to English, just show original articles
    if (lang === "en") {
      setTranslatedArticles(articles);
      setTranslating(false);
      return;
    }

    try {
      // Show translating message
      setSnackbar({
        open: true,
        message: `Translating articles to ${lang === "kn" ? "Kannada" : "Hindi"}...`,
        severity: "info"
      });

      // Translate all articles in parallel with concurrency limit
      const translated = [];
      const batchSize = 3; // Process 3 articles at a time
      
      for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (article) => {
            try {
              const [translatedTitle, translatedContent] = await Promise.all([
                translateText(article.title, lang),
                translateText(article.content, lang)
              ]);

              return {
                ...article,
                title: translatedTitle,
                content: translatedContent
              };
            } catch (err) {
              console.error(`Failed to translate article ${article.id}:`, err);
              return article; // Return original if translation fails
            }
          })
        );
        translated.push(...batchResults);
      }

      setTranslatedArticles(translated);
      
      setSnackbar({
        open: true,
        message: "Translation completed",
        severity: "success"
      });
    } catch (error) {
      console.error("Language change failed:", error);
      setSnackbar({
        open: true,
        message: "Translation failed. Showing original text.",
        severity: "error"
      });
    } finally {
      setTranslating(false);
    }
  };

  /* ================= SKELETON ================= */

  const SkeletonCard = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, borderRadius: 2 }} />
      <Skeleton width="60%" height={32} />
      <Skeleton width="30%" height={20} />
      <Divider sx={{ my: 2 }} />
      <Skeleton height={60} />
      <Skeleton height={60} width="90%" />
    </Paper>
  );

  /* ================= HANDLE CLOSE SNACKBAR ================= */

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>

      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 800, color: "#2e7d32" }}
      >
        Latest Updates & Articles
      </Typography>

      {/* ================= LANGUAGE BUTTONS ================= */}

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant={language === "en" ? "contained" : "outlined"}
          onClick={() => changeLanguage("en")}
          disabled={translating}
          sx={{
            textTransform: "none",
            backgroundColor: language === "en" ? "#2e7d32" : "",
            '&:hover': {
              backgroundColor: language === "en" ? "#1b5e20" : "",
            }
          }}
        >
          English
        </Button>

        <Button
          variant={language === "kn" ? "contained" : "outlined"}
          onClick={() => changeLanguage("kn")}
          disabled={translating}
          sx={{
            textTransform: "none",
            backgroundColor: language === "kn" ? "#2e7d32" : "",
            '&:hover': {
              backgroundColor: language === "kn" ? "#1b5e20" : "",
            }
          }}
        >
          ಕನ್ನಡ
        </Button>

       
      </Stack>

      {/* ================= TRANSLATING INDICATOR ================= */}

      {translating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Translating articles... Please wait.
        </Alert>
      )}

      {/* ================= ARTICLES GRID ================= */}

      <Grid container spacing={3}>
        {loading &&
          [...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SkeletonCard />
            </Grid>
          ))
        }

        {!loading && translatedArticles.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No articles available
              </Typography>
            </Paper>
          </Grid>
        )}

        {!loading &&
          translatedArticles.map((article) => (
            <Grid item xs={12} md={6} key={article.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: "0.3s",
                  "&:hover": {
                    transform: 'translateY(-4px)',
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }
                }}
              >
                {article.image && (
                  <Box
                    component="img"
                    src={`${IMAGE_URL}${article.image}`}
                    alt={article.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 2,
                      mb: 2
                    }}
                  />
                )}

                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: 700, 
                    color: "#1b5e20",
                    mb: 1
                  }}
                >
                  {article.title}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(article.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography 
                  sx={{ 
                    lineHeight: 1.7,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {article.content}
                </Typography>
              </Paper>
            </Grid>
          ))
        }
      </Grid>

      {/* ================= SNACKBAR FOR NOTIFICATIONS ================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicArticles;
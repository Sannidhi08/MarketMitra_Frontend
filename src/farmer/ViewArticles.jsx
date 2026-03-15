import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Button,
  Stack,
  Alert,
  Snackbar,
  Chip
} from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';

const IMAGE_URL = "http://localhost:3003/uploads/articles/";
const TRANSLATE_URL = "http://localhost:3003/api/articles/translate";

const ViewArticles = () => {
  const [articles, setArticles] = useState([]);
  const [translatedArticles, setTranslatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [language, setLanguage] = useState("en");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  useEffect(() => {
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/articles");
      setArticles(res.data.articles || []);
      setTranslatedArticles(res.data.articles || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch articles",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

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
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return res.data.translatedText || text;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // Return original text on error
    }
  };

  /* ================= CHANGE LANGUAGE ================= */

  const changeLanguage = async (lang) => {
    if (lang === language) return; // Skip if same language
    
    setLanguage(lang);
    
    // If switching back to English, just show original articles
    if (lang === "en") {
      setTranslatedArticles(articles);
      return;
    }

    setTranslating(true);
    
    try {
      setSnackbar({
        open: true,
        message: `Translating articles to ${lang === "kn" ? "Kannada" : "Hindi"}...`,
        severity: "info"
      });

      // Translate all articles
      const translated = await Promise.all(
        articles.map(async (article) => {
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

      setTranslatedArticles(translated);
      
      setSnackbar({
        open: true,
        message: "Translation completed successfully",
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

  /* ================= HANDLE CLOSE SNACKBAR ================= */

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f1f8f4", minHeight: "100vh" }}>

      {/* PAGE HEADER WITH LANGUAGE SELECTOR */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1b5e20" }}
        >
          📰 Admin Articles
        </Typography>

        {/* LANGUAGE BUTTONS */}
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<TranslateIcon />}
            label="English"
            onClick={() => changeLanguage("en")}
            color={language === "en" ? "success" : "default"}
            variant={language === "en" ? "filled" : "outlined"}
            disabled={translating}
            sx={{ 
              '& .MuiChip-label': { px: 2 },
              backgroundColor: language === "en" ? "#2e7d32" : "",
              color: language === "en" ? "white" : ""
            }}
          />
          <Chip
            label="ಕನ್ನಡ"
            onClick={() => changeLanguage("kn")}
            color={language === "kn" ? "success" : "default"}
            variant={language === "kn" ? "filled" : "outlined"}
            disabled={translating}
            sx={{ 
              '& .MuiChip-label': { px: 2 },
              backgroundColor: language === "kn" ? "#2e7d32" : "",
              color: language === "kn" ? "white" : ""
            }}
          />
          <Chip
            label="हिन्दी"
            onClick={() => changeLanguage("hi")}
            color={language === "hi" ? "success" : "default"}
            variant={language === "hi" ? "filled" : "outlined"}
            disabled={translating}
            sx={{ 
              '& .MuiChip-label': { px: 2 },
              backgroundColor: language === "hi" ? "#2e7d32" : "",
              color: language === "hi" ? "white" : ""
            }}
          />
        </Stack>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Official updates, announcements, and guidance shared by the admin.
        {language !== "en" && (
          <Chip 
            label={`Showing in ${language === "kn" ? "Kannada" : "Hindi"}`}
            size="small"
            color="success"
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* TRANSLATING INDICATOR */}
      {translating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={20} color="success" />
            <span>Translating articles... Please wait.</span>
          </Box>
        </Alert>
      )}

      {/* LOADING */}
      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress color="success" />
        </Box>
      ) : translatedArticles.length === 0 ? (

        /* EMPTY STATE */
        <Typography textAlign="center" color="text.secondary">
          No articles available at the moment 🌱
        </Typography>

      ) : (

        /* ARTICLES LIST */
        translatedArticles.map((article) => (
          <Paper
            key={article.id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              borderLeft: "6px solid #2e7d32",
              display: "flex",
              gap: 3,
              alignItems: "flex-start",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              },
              opacity: translating ? 0.7 : 1,
            }}
          >

            {/* ARTICLE IMAGE */}
            {article.image && (
              <Box
                component="img"
                src={`${IMAGE_URL}${article.image}`}
                alt={article.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
                }}
                sx={{
                  width: 160,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
            )}

            {/* ARTICLE TEXT */}
            <Box sx={{ flex: 1 }}>

              {/* TITLE WITH LANGUAGE INDICATOR */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1b5e20" }}
                >
                  {article.title}
                </Typography>
                {language !== "en" && (
                  <Chip 
                    label={language === "kn" ? "KN" : "HI"}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* DATE */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Published on{" "}
                {new Date(article.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

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

              {/* TRANSLATION NOTE */}
              {language !== "en" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}
                >
                  * Translated from English
                </Typography>
              )}

            </Box>

          </Paper>
        ))
      )}

      {/* SNACKBAR FOR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default ViewArticles;
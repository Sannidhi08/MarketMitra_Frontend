import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ManageArticles = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articles, setArticles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Load articles from localStorage
  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    setArticles(storedArticles);
  }, []);

  // Save articles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(articles));
  }, [articles]);

  // Add new article
  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Please enter both title and content.");
      return;
    }

    const newArticle = { title: trimmedTitle, content: trimmedContent };
    setArticles([...articles, newArticle]);
    setTitle("");
    setContent("");
  };

  // Open edit dialog
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditTitle(articles[index].title);
    setEditContent(articles[index].content);
    setOpenDialog(true);
  };

  // Save edited article
  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Title and content cannot be empty.");
      return;
    }

    const updatedArticles = [...articles];
    updatedArticles[editIndex] = { title: trimmedTitle, content: trimmedContent };
    setArticles(updatedArticles);

    setOpenDialog(false);
    setEditIndex(null);
    setEditTitle("");
    setEditContent("");
  };

  // Delete article
  const handleDelete = (index) => {
    const updatedArticles = articles.filter((_, i) => i !== index);
    setArticles(updatedArticles);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Articles
      </Typography>

      {/* Add Article */}
      <TextField
        label="Article Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Article Content"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Article
      </Button>

      {/* Articles List */}
      <Typography variant="h6" gutterBottom>
        Articles List
      </Typography>
      {articles.length === 0 ? (
        <Typography>No articles added yet.</Typography>
      ) : (
        <List>
          {articles.map((article, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(index)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={article.title}
                secondary={article.content.length > 50 ? article.content.substring(0, 50) + "..." : article.content}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          <TextField
            label="Article Title"
            fullWidth
            margin="normal"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            label="Article Content"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageArticles;

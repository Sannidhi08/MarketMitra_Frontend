import React, { useEffect, useState } from "react";
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
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const BASE_URL = "http://localhost:3003/api/articles";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const adminId = localStorage.getItem("userId");

  /* FETCH ARTICLES */
  const fetchArticles = async () => {
    const res = await axios.get(BASE_URL);
    setArticles(res.data.articles || []);
  };

  /* ADD ARTICLE */
  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content required");
      return;
    }

    setLoading(true);
    await axios.post(
      `${BASE_URL}/add`,
      { title, content },
      { headers: { "x-user-id": adminId } }
    );

    setTitle("");
    setContent("");
    fetchArticles();
    setLoading(false);
  };

  /* OPEN EDIT */
  const openEdit = (article) => {
    setEditId(article.id);
    setEditTitle(article.title);
    setEditContent(article.content);
    setOpen(true);
  };

  /* SAVE EDIT */
  const saveEdit = async () => {
    await axios.put(
      `${BASE_URL}/update/${editId}`,
      { title: editTitle, content: editContent },
      { headers: { "x-user-id": adminId } }
    );

    setOpen(false);
    fetchArticles();
  };

  /* DELETE */
  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;

    await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: { "x-user-id": adminId }
    });

    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Manage Articles</Typography>

      <TextField
        label="Article Title"
        fullWidth
        sx={{ mt: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Article Content"
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : "Add Article"}
      </Button>

      <List sx={{ mt: 4 }}>
        {articles.map((a) => (
          <ListItem
            key={a.id}
            divider
            secondaryAction={
              <>
                <IconButton onClick={() => openEdit(a)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => remove(a.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={a.title}
              secondary={a.content.slice(0, 80) + "..."}
            />
          </ListItem>
        ))}
      </List>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 1 }}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            sx={{ mt: 2 }}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageArticles;

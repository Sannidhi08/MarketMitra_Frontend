import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TablePagination,
  InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const BASE_URL = "http://localhost:3003/api/articles";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const adminId = localStorage.getItem("userId");

  /* ================= FETCH ================= */
  const fetchArticles = async () => {
    const res = await axios.get(BASE_URL);
    setArticles(res.data.articles || []);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;

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

  /* ================= EDIT ================= */
  const openEditDialog = (article) => {
    setEditId(article.id);
    setEditTitle(article.title);
    setEditContent(article.content);
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    await axios.put(
      `${BASE_URL}/update/${editId}`,
      { title: editTitle, content: editContent },
      { headers: { "x-user-id": adminId } }
    );

    setOpenEdit(false);
    fetchArticles();
  };

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    await axios.delete(`${BASE_URL}/delete/${deleteId}`, {
      headers: { "x-user-id": adminId }
    });

    setOpenDelete(false);
    fetchArticles();
  };

  /* ================= FILTER ================= */
  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", p: 4 }}>
      <Paper sx={{ maxWidth: 1200, mx: "auto", p: 4, borderRadius: 3 }}>

        {/* HEADER */}
        <Typography variant="h5" fontWeight={700} color="#2e7d32">
          Article Management
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Create and manage educational articles
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ADD FORM */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "#fafafa"
          }}
        >
          <Typography fontWeight={600} mb={2}>
            Add New Article
          </Typography>

          <TextField
            label="Article Title"
            fullWidth
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Article Content"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={loading}
            sx={{
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Add Article"}
          </Button>
        </Paper>

        {/* SEARCH */}
        <TextField
          fullWidth
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        {/* TABLE */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>

            <TableHead sx={{ background: "#eef3ef" }}>
              <TableRow>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Preview</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No articles found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {a.title}
                    </TableCell>
                    <TableCell>
                      {a.content.slice(0, 100)}...
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openEditDialog(a)}>
                        <EditIcon sx={{ color: "#1976d2" }} />
                      </IconButton>
                      <IconButton onClick={() => confirmDelete(a.id)}>
                        <DeleteIcon sx={{ color: "#d32f2f" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* EDIT DIALOG */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              sx={{ mb: 2 }}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={saveEdit}
              sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRM DIALOG */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete Article</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this article?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </Box>
  );
};

export default ManageArticles;
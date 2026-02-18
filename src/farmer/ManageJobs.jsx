import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField, Button, Typography, Paper,
  Alert, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";

const ManageJobs = () => {

  const farmerId = localStorage.getItem("userId");

  const [jobs,setJobs] = useState([]);
  const [msg,setMsg] = useState("");

  const [form,setForm] = useState({
    title:"",
    description:"",
    location:"",
    salary:""
  });

  const [editId,setEditId] = useState(null);
  const [open,setOpen] = useState(false);

  /* LOAD JOBS */
  const loadJobs = async () => {
    try{
      if(!farmerId) return setMsg("Login required");

      const res = await axios.get(
        `http://localhost:3003/jobs/farmer/${farmerId}`
      );

      setJobs(res.data.jobs);

    }catch(err){
      console.error(err);
      setMsg("Failed to load jobs");
    }
  };

  useEffect(()=>{ loadJobs(); },[]);


  /* INPUT */
  const handleChange = e =>
    setForm({...form,[e.target.name]:e.target.value});


  /* ADD JOB */
  const handlePost = async () => {
    try{
      if(!form.title)
        return setMsg("Title required");

      await axios.post(
        "http://localhost:3003/jobs/add",
        { farmer_id:farmerId, ...form }
      );

      setMsg("Job Posted Successfully ✅");

      setForm({
        title:"",
        description:"",
        location:"",
        salary:""
      });

      loadJobs();

    }catch{
      setMsg("Post failed ❌");
    }
  };


  /* DELETE */
  const del = async id => {
    try{
      await axios.delete(
        `http://localhost:3003/jobs/delete/${id}`
      );
      loadJobs();
    }catch{
      setMsg("Delete failed");
    }
  };


  /* OPEN EDIT */
  const openEdit = job => {
    setEditId(job.id);
    setForm(job);
    setOpen(true);
  };


  /* SAVE EDIT */
  const saveEdit = async () => {
    try{
      await axios.put(
        `http://localhost:3003/jobs/update/${editId}`,
        form
      );

      setOpen(false);
      loadJobs();

    }catch{
      setMsg("Update failed");
    }
  };


  return (
    <div style={{maxWidth:900,margin:"auto"}}>

      {/* FORM */}
      <Paper sx={{p:3}}>
        <Typography variant="h5">Post Job</Typography>

        {msg && <Alert sx={{mt:2}}>{msg}</Alert>}

        <TextField fullWidth label="Title" name="title"
          value={form.title}
          onChange={handleChange}
          sx={{mt:2}}/>

        <TextField fullWidth label="Description" name="description"
          value={form.description}
          onChange={handleChange}
          multiline rows={3}
          sx={{mt:2}}/>

        <TextField fullWidth label="Location" name="location"
          value={form.location}
          onChange={handleChange}
          sx={{mt:2}}/>

        <TextField fullWidth label="Salary" name="salary"
          value={form.salary}
          onChange={handleChange}
          sx={{mt:2}}/>

        <Button variant="contained" fullWidth sx={{mt:3}}
          onClick={handlePost}>
          Post Job
        </Button>
      </Paper>


      {/* LIST */}
      <Typography variant="h5" sx={{mt:4}}>
        Your Jobs
      </Typography>

      <Grid container spacing={2} sx={{mt:1}}>
        {jobs.map(job=>(
          <Grid item xs={12} md={6} key={job.id}>
            <Paper sx={{p:2}}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography>{job.description}</Typography>
              <Typography>📍 {job.location}</Typography>
              <Typography>₹ {job.salary}</Typography>

              <Button onClick={()=>openEdit(job)}>
                Edit
              </Button>

              <Button color="error" onClick={()=>del(job.id)}>
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>


      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Edit Job</DialogTitle>

        <DialogContent>

          <TextField fullWidth name="title" label="Title"
            value={form.title}
            onChange={handleChange}
            sx={{mt:1}}/>

          <TextField fullWidth name="description" label="Description"
            value={form.description}
            onChange={handleChange}
            multiline rows={3}
            sx={{mt:2}}/>

          <TextField fullWidth name="location" label="Location"
            value={form.location}
            onChange={handleChange}
            sx={{mt:2}}/>

          <TextField fullWidth name="salary" label="Salary"
            value={form.salary}
            onChange={handleChange}
            sx={{mt:2}}/>

        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ManageJobs;

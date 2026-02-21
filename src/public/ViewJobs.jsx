import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField
} from "@mui/material";

const ViewJobs = () => {

  const [jobs,setJobs] = useState([]);
  const [open,setOpen] = useState(false);
  const [selected,setSelected] = useState(null);
  const [copied,setCopied] = useState(false);

  /* ================= FETCH JOBS ================= */

  useEffect(()=>{
    const fetchJobs = async () => {
      try{
        const res = await axios.get("http://localhost:3003/jobs/all");
        setJobs(res.data.jobs);
      }catch(err){
        console.error("Fetch jobs failed",err);
      }
    };

    fetchJobs();
  },[]);

  /* ================= OPEN CONTACT ================= */

  const handleContact = (job)=>{
    setSelected(job);
    setOpen(true);
    setCopied(false);
  };

  const handleClose = ()=>{
    setOpen(false);
    setSelected(null);
  };

  /* ================= COPY NUMBER ================= */

  const handleCopy = async ()=>{
    if(!selected?.phone) return;

    try{
      await navigator.clipboard.writeText(selected.phone);
      setCopied(true);

      setTimeout(()=>setCopied(false),2000);
    }catch(err){
      console.error("Copy failed",err);
    }
  };

  return (
    <div style={{maxWidth:1000,margin:"auto"}}>

      <Typography variant="h4" sx={{mb:3}}>
        Available Jobs
      </Typography>

      <Grid container spacing={2}>
        {jobs.map(job=>(
          <Grid item xs={12} md={6} key={job.id}>
            <Paper sx={{p:2}}>

              <Typography variant="h6">{job.title}</Typography>

              <Typography sx={{mt:1}}>
                {job.description}
              </Typography>

              <Typography sx={{mt:1}}>
                📍 {job.location}
              </Typography>

              <Typography>
                💰 ₹ {job.salary}
              </Typography>

              <Typography sx={{mt:1}}>
                👨‍🌾 Posted by: {job.name}
              </Typography>

              <Button
                variant="contained"
                sx={{mt:2}}
                onClick={()=>handleContact(job)}
              >
                Contact Farmer
              </Button>

            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ================= CONTACT MODAL ================= */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Farmer Contact Details</DialogTitle>

        {selected && (
          <DialogContent>

            <Typography variant="h6">
              {selected.name}
            </Typography>

            {/* PHONE BOX */}
            <Box sx={{mt:2}}>
              <Typography variant="body2">Phone Number</Typography>

              <TextField
                value={selected.phone}
                fullWidth
                InputProps={{ readOnly:true }}
                sx={{mt:1}}
              />

              <Button
                variant="outlined"
                sx={{mt:1}}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Number"}
              </Button>
            </Box>

            <Typography sx={{mt:2}}>
              📍 Location: {selected.location}
            </Typography>

            <Typography sx={{mt:1}}>
              💰 Salary: ₹ {selected.salary}
            </Typography>

          </DialogContent>
        )}

        <DialogActions>

          <Button onClick={handleClose}>
            Close
          </Button>

        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ViewJobs;
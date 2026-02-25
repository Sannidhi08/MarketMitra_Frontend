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
  TextField,
  Divider,
  Skeleton
} from "@mui/material";

const ViewJobs = () => {

  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
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
      }finally{
        setLoading(false);
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

  /* ================= SKELETON CARD ================= */

  const SkeletonCard = () => (
    <Paper
      elevation={0}
      sx={{
        p:3,
        borderRadius:3,
        border:"1px solid #e0e0e0"
      }}
    >
      <Skeleton variant="text" width="60%" height={35}/>
      <Skeleton variant="text" width="90%"/>
      <Skeleton variant="text" width="80%"/>

      <Divider sx={{my:2}}/>

      <Skeleton width="50%"/>
      <Skeleton width="40%"/>
      <Skeleton width="60%"/>

      <Skeleton
        variant="rounded"
        width={160}
        height={40}
        sx={{mt:2}}
      />
    </Paper>
  );

  return (
    <Box sx={{maxWidth:1150,mx:"auto"}}>

      {/* Header */}
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb:3,
          color:"#2e7d32",
          letterSpacing:0.5
        }}
      >
        Available Jobs
      </Typography>

      {/* JOB GRID */}
      <Grid container spacing={3}>

        {/* LOADING STATE */}
        {loading &&
          [...Array(6)].map((_,i)=>(
            <Grid item xs={12} md={6} key={i}>
              <SkeletonCard/>
            </Grid>
          ))
        }

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <Box sx={{width:"100%",textAlign:"center",mt:6}}>
            <Typography variant="h6" color="text.secondary">
              No jobs available right now
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mt:1}}>
              Please check again later
            </Typography>
          </Box>
        )}

        {/* JOB CARDS */}
        {!loading && jobs.map(job=>(
          <Grid item xs={12} md={6} key={job.id}>
            <Paper
              elevation={0}
              sx={{
                p:3,
                borderRadius:3,
                border:"1px solid #e0e0e0",
                transition:"all .25s ease",
                background:"#fff",
                "&:hover":{
                  boxShadow:"0 10px 30px rgba(0,0,0,0.08)",
                  transform:"translateY(-4px)"
                }
              }}
            >

              {/* Title */}
              <Typography variant="h6" fontWeight={700}>
                {job.title}
              </Typography>

              {/* Description */}
              <Typography sx={{mt:1,color:"#5f6368"}}>
                {job.description}
              </Typography>

              <Divider sx={{my:2}}/>

              {/* Details */}
              <Typography>📍 {job.location}</Typography>

              <Typography sx={{mt:1}}>
                💰 ₹ {job.salary}
              </Typography>

              <Typography sx={{mt:1}}>
                👨‍🌾 Posted by: <b>{job.name}</b>
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                onClick={()=>handleContact(job)}
                sx={{
                  mt:2,
                  borderRadius:2,
                  textTransform:"none",
                  fontWeight:700,
                  px:3,
                  background:"#2e7d32",
                  boxShadow:"0 4px 14px rgba(46,125,50,0.3)",
                  "&:hover":{
                    background:"#256428"
                  }
                }}
              >
                Contact Farmer
              </Button>

            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ================= CONTACT MODAL ================= */}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx:{
            borderRadius:3,
            p:1,
            minWidth:320
          }
        }}
      >
        <DialogTitle sx={{ fontWeight:700 }}>
          Farmer Contact Details
        </DialogTitle>

        {selected && (
          <DialogContent>

            <Typography variant="h6" fontWeight={700}>
              {selected.name}
            </Typography>

            <Box sx={{mt:2}}>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>

              <TextField
                value={selected.phone}
                fullWidth
                InputProps={{ readOnly:true }}
                sx={{mt:1}}
              />

              <Button
                variant="outlined"
                sx={{
                  mt:1,
                  borderRadius:2,
                  textTransform:"none",
                  fontWeight:600
                }}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Number"}
              </Button>
            </Box>

            <Divider sx={{my:2}}/>

            <Typography>
              📍 Location: <b>{selected.location}</b>
            </Typography>

            <Typography sx={{mt:1}}>
              💰 Salary: <b>₹ {selected.salary}</b>
            </Typography>

          </DialogContent>
        )}

        <DialogActions sx={{p:2}}>
          <Button
            onClick={handleClose}
            sx={{textTransform:"none",fontWeight:600}}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ViewJobs;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Grid, Paper, Button } from "@mui/material";

const ViewJobs = () => {

  const [jobs,setJobs] = useState([]);

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
                href={`tel:${job.phone}`}
              >
                Contact Farmer
              </Button>

            </Paper>
          </Grid>
        ))}
      </Grid>

    </div>
  );
};

export default ViewJobs;

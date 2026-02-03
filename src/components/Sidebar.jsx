import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

const Sidebar = () => {
  return (
    <Paper sx={{ width: 200, height: "100vh", p: 1 }}>
      <List>
        <ListItem button>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem button>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Sidebar;

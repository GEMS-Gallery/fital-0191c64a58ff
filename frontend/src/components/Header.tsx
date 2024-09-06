import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Workout Planner
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile">
            Profile
          </Button>
          <Button color="inherit" component={RouterLink} to="/workout-plan">
            Workout Plan
          </Button>
          <Button color="inherit" component={RouterLink} to="/exercises">
            Exercises
          </Button>
          <Button color="inherit" component={RouterLink} to="/progress">
            Progress
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

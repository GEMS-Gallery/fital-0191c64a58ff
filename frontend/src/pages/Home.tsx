import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your Personalized Workout Planner
        </Typography>
        <Typography variant="body1" paragraph>
          Get started by creating your profile and generating a customized workout plan.
        </Typography>
        <Button variant="contained" color="primary" component={RouterLink} to="/profile">
          Create Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

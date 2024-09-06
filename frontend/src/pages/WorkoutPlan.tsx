import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

type Exercise = {
  0: string; // name
  1: number; // sets
  2: number; // reps
};

type WorkoutPlan = {
  userId: bigint;
  exercises: Exercise[];
};

const WorkoutPlan: React.FC = () => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);
      // Assuming the user ID is 1 for this example. In a real app, you'd get this from authentication.
      const result = await backend.generateWorkoutPlan(BigInt(1));
      if ('ok' in result) {
        setWorkoutPlan(result.ok);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to fetch workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Workout Plan
        </Typography>
        {workoutPlan ? (
          <List>
            {workoutPlan.exercises.map((exercise, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={exercise[0]}
                  secondary={`${exercise[1]} sets of ${exercise[2]} reps`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No workout plan available. Generate one to get started!</Typography>
        )}
        <Button variant="contained" color="primary" onClick={fetchWorkoutPlan} sx={{ mt: 2 }}>
          Generate New Plan
        </Button>
      </Box>
    </Container>
  );
};

export default WorkoutPlan;

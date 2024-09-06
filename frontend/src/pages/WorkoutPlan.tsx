import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress, Checkbox } from '@mui/material';
import { backend } from '../../declarations/backend';

type Exercise = {
  0: string; // name
  1: number; // sets
  2: number; // reps
  3: boolean; // completed
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
        const planWithCompletionStatus = {
          ...result.ok,
          exercises: result.ok.exercises.map(ex => [...ex, false] as Exercise)
        };
        setWorkoutPlan(planWithCompletionStatus);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to fetch workout plan');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseCompletion = (index: number) => {
    if (workoutPlan) {
      const updatedExercises = [...workoutPlan.exercises];
      updatedExercises[index] = [...updatedExercises[index].slice(0, 3), !updatedExercises[index][3]] as Exercise;
      setWorkoutPlan({ ...workoutPlan, exercises: updatedExercises });
    }
  };

  const handleWorkoutCompletion = async () => {
    if (workoutPlan) {
      try {
        const completedWorkout = {
          userId: workoutPlan.userId,
          date: BigInt(Date.now()),
          completedExercises: workoutPlan.exercises
        };
        await backend.logWorkoutProgress(Number(workoutPlan.userId), completedWorkout);
        // Optionally, you can show a success message or redirect to the progress page
      } catch (err) {
        setError('Failed to log workout completion');
      }
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
          <>
            <List>
              {workoutPlan.exercises.map((exercise, index) => (
                <ListItem key={index}>
                  <Checkbox
                    checked={exercise[3]}
                    onChange={() => handleExerciseCompletion(index)}
                  />
                  <ListItemText
                    primary={exercise[0]}
                    secondary={`${exercise[1]} sets of ${exercise[2]} reps`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={handleWorkoutCompletion}
              sx={{ mt: 2, mr: 2 }}
            >
              Workout Completed
            </Button>
          </>
        ) : (
          <Typography>No workout plan available. Generate one to get started!</Typography>
        )}
        <Button variant="contained" color="secondary" onClick={fetchWorkoutPlan} sx={{ mt: 2 }}>
          Generate New Plan
        </Button>
      </Box>
    </Container>
  );
};

export default WorkoutPlan;

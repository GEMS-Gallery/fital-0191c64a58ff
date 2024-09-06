import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Checkbox, Select, MenuItem, Button } from '@mui/material';
import { useWorkout } from '../contexts/WorkoutContext';
import { backend } from '../../declarations/backend';

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  userDifficulty: string;
};

const Exercises: React.FC = () => {
  const { workoutPlan, setWorkoutPlan } = useWorkout();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (workoutPlan) {
      setExercises(workoutPlan.exercises);
    } else {
      fetchCurrentWorkoutPlan();
    }
  }, [workoutPlan]);

  const fetchCurrentWorkoutPlan = async () => {
    try {
      const result = await backend.getCurrentWorkoutPlan();
      if (result) {
        setWorkoutPlan(result);
        setExercises(result.exercises);
      }
    } catch (error) {
      console.error('Error fetching current workout plan:', error);
    }
  };

  const handleExerciseCompletion = async (index: number, completed: boolean) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].completed = completed;
    setExercises(updatedExercises);
    await updateExerciseStatus(updatedExercises[index]);
  };

  const handleDifficultyChange = async (index: number, difficulty: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].userDifficulty = difficulty;
    setExercises(updatedExercises);
    await updateExerciseStatus(updatedExercises[index]);
  };

  const updateExerciseStatus = async (exercise: Exercise) => {
    try {
      await backend.updateExerciseStatus(exercise.name, exercise.completed, exercise.userDifficulty);
    } catch (error) {
      console.error('Error updating exercise status:', error);
    }
  };

  const handleSaveProgress = async () => {
    try {
      await backend.saveWorkoutProgress();
      // Optionally, you can redirect to the progress page or show a success message
    } catch (error) {
      console.error('Error saving workout progress:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Workout Plan
        </Typography>
        <List>
          {exercises.map((exercise, index) => (
            <ListItem key={index}>
              <Checkbox
                checked={exercise.completed}
                onChange={(e) => handleExerciseCompletion(index, e.target.checked)}
              />
              <ListItemText
                primary={exercise.name}
                secondary={`${exercise.sets} sets of ${exercise.reps} reps`}
              />
              <Select
                value={exercise.userDifficulty}
                onChange={(e) => handleDifficultyChange(index, e.target.value as string)}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleSaveProgress} sx={{ mt: 2 }}>
          Save Progress
        </Button>
      </Box>
    </Container>
  );
};

export default Exercises;

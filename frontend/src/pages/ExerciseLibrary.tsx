import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

type Exercise = {
  name: string;
  description: string;
  difficulty: number;
};

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const result = await backend.getExerciseLibrary();
      setExercises(result);
    } catch (err) {
      setError('Failed to fetch exercises');
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
          Exercise Library
        </Typography>
        <List>
          {exercises.map((exercise, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={exercise.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      Difficulty: {exercise.difficulty}
                    </Typography>
                    <br />
                    {exercise.description}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ExerciseLibrary;

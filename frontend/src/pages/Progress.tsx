import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { backend } from '../../declarations/backend';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type WorkoutProgress = {
  userId: bigint;
  date: bigint;
  completedExercises: [string, number, number, boolean][];
};

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<WorkoutProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      // Assuming the user ID is 1 for this example. In a real app, you'd get this from authentication.
      const result = await backend.getProgressHistory(BigInt(1));
      setProgressData(result);
    } catch (err) {
      setError('Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    const dates = progressData.map(entry => new Date(Number(entry.date) / 1000000).toLocaleDateString());
    const totalExercises = progressData.map(entry => entry.completedExercises.filter(ex => ex[3]).length);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Exercises Completed',
          data: totalExercises,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Progress
        </Typography>
        {progressData.length > 0 ? (
          <>
            <Box sx={{ mt: 4 }}>
              <Line data={prepareChartData()} />
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Workout History
              </Typography>
              <List>
                {progressData.map((workout, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={new Date(Number(workout.date) / 1000000).toLocaleString()}
                      secondary={
                        <>
                          {workout.completedExercises.map((exercise, exIndex) => (
                            <Typography key={exIndex} component="span" variant="body2" display="block">
                              {exercise[0]}: {exercise[1]} sets of {exercise[2]} reps - {exercise[3] ? 'Completed' : 'Not completed'}
                            </Typography>
                          ))}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        ) : (
          <Typography>No progress data available yet. Keep working out!</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Progress;

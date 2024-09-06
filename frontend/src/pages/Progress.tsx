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
  date: bigint;
  completedExercises: [string, number, number, boolean][];
};

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<WorkoutProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll use mock data since we don't have a way to fetch progress data
    const mockProgressData: WorkoutProgress[] = [
      {
        date: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedExercises: [
          ["Push-ups", 3, 10, true],
          ["Squats", 3, 12, true],
          ["Plank", 3, 30, false],
        ],
      },
      {
        date: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedExercises: [
          ["Push-ups", 3, 12, true],
          ["Squats", 3, 15, true],
          ["Plank", 3, 45, true],
        ],
      },
      {
        date: BigInt(Date.now()),
        completedExercises: [
          ["Push-ups", 4, 12, true],
          ["Squats", 4, 15, true],
          ["Plank", 3, 60, true],
          ["Lunges", 3, 10, true],
        ],
      },
    ];

    setProgressData(mockProgressData);
    setLoading(false);
  }, []);

  const prepareChartData = () => {
    const dates = progressData.map(entry => new Date(Number(entry.date)).toLocaleDateString());
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
                      primary={new Date(Number(workout.date)).toLocaleString()}
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

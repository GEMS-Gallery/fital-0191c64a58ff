import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from '../../declarations/backend';
import { useWorkout } from '../contexts/WorkoutContext';

type ProfileFormData = {
  goals: string[];
  fitnessLevel: string;
  preferences: string[];
  equipment: string[];
};

const Profile: React.FC = () => {
  const { control, handleSubmit } = useForm<ProfileFormData>();
  const [otherPreference, setOtherPreference] = useState('');
  const [otherEquipment, setOtherEquipment] = useState('');
  const { setWorkoutPlan } = useWorkout();
  const navigate = useNavigate();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const preferences = {
        goals: data.goals,
        fitnessLevel: data.fitnessLevel,
        preferences: data.preferences.includes('Other') ? [...data.preferences.filter(p => p !== 'Other'), otherPreference] : data.preferences,
        equipment: data.equipment.includes('Other') ? [...data.equipment.filter(e => e !== 'Other'), otherEquipment] : data.equipment,
      };

      const result = await backend.generateWorkoutPlan(preferences);
      if ('ok' in result) {
        setWorkoutPlan(result.ok);
        navigate('/exercises');
      } else {
        console.error('Error generating workout plan:', result.err);
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Workout Plan
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="goals"
            control={control}
            defaultValue={[]}
            rules={{ required: 'Fitness goals are required' }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Fitness Goals</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                  <MenuItem value="Muscle Gain">Muscle Gain</MenuItem>
                  <MenuItem value="Endurance">Endurance</MenuItem>
                  <MenuItem value="Flexibility">Flexibility</MenuItem>
                  <MenuItem value="General Fitness">General Fitness</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="fitnessLevel"
            control={control}
            defaultValue=""
            rules={{ required: 'Fitness level is required' }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Current Fitness Level</InputLabel>
                <Select {...field}>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="preferences"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth margin="normal">
                <Typography variant="subtitle1">Workout Preferences</Typography>
                <FormGroup>
                  {['Cardio', 'Strength Training', 'HIIT', 'Yoga', 'Pilates', 'Other'].map((pref) => (
                    <FormControlLabel
                      key={pref}
                      control={
                        <Checkbox
                          checked={field.value.includes(pref)}
                          onChange={(e) => {
                            const updatedPreferences = e.target.checked
                              ? [...field.value, pref]
                              : field.value.filter((p: string) => p !== pref);
                            field.onChange(updatedPreferences);
                          }}
                        />
                      }
                      label={pref}
                    />
                  ))}
                </FormGroup>
                {field.value.includes('Other') && (
                  <TextField
                    label="Other Preference"
                    value={otherPreference}
                    onChange={(e) => setOtherPreference(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                )}
              </FormControl>
            )}
          />
          <Controller
            name="equipment"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <FormControl component="fieldset" fullWidth margin="normal">
                <Typography variant="subtitle1">Available Equipment</Typography>
                <FormGroup>
                  {['Dumbbells', 'Resistance Bands', 'Treadmill', 'Exercise Bike', 'None', 'Other'].map((equip) => (
                    <FormControlLabel
                      key={equip}
                      control={
                        <Checkbox
                          checked={field.value.includes(equip)}
                          onChange={(e) => {
                            const updatedEquipment = e.target.checked
                              ? [...field.value, equip]
                              : field.value.filter((e: string) => e !== equip);
                            field.onChange(updatedEquipment);
                          }}
                        />
                      }
                      label={equip}
                    />
                  ))}
                </FormGroup>
                {field.value.includes('Other') && (
                  <TextField
                    label="Other Equipment"
                    value={otherEquipment}
                    onChange={(e) => setOtherEquipment(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                )}
              </FormControl>
            )}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Generate Workout Plan
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Slider, Chip } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from '../../declarations/backend';

type ProfileFormData = {
  goals: string;
  fitnessLevel: number;
  preferences: string[];
};

const Profile: React.FC = () => {
  const { control, handleSubmit } = useForm<ProfileFormData>();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState('');

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await backend.createUserProfile({
        id: 0, // The backend will assign the actual ID
        goals: data.goals,
        fitnessLevel: data.fitnessLevel,
        preferences: preferences,
      });
      console.log('Profile created:', result);
      // Handle success (e.g., show a success message, redirect to workout plan page)
    } catch (error) {
      console.error('Error creating profile:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const addPreference = () => {
    if (newPreference && !preferences.includes(newPreference)) {
      setPreferences([...preferences, newPreference]);
      setNewPreference('');
    }
  };

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Profile
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="goals"
            control={control}
            defaultValue=""
            rules={{ required: 'Goals are required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Fitness Goals"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="fitnessLevel"
            control={control}
            defaultValue={1}
            rules={{ required: 'Fitness level is required' }}
            render={({ field }) => (
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Fitness Level</Typography>
                <Slider
                  {...field}
                  aria-label="Fitness Level"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={5}
                />
              </Box>
            )}
          />
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Exercise Preferences</Typography>
            <TextField
              label="Add Preference"
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPreference()}
            />
            <Button onClick={addPreference}>Add</Button>
            <Box sx={{ mt: 1 }}>
              {preferences.map((pref) => (
                <Chip
                  key={pref}
                  label={pref}
                  onDelete={() => removePreference(pref)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Box>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;

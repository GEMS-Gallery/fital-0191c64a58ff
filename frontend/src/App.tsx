import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

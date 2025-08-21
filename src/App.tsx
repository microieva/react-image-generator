import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GenerateStream from './components/GenerateStream';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToGenerate = () => {
    navigate('/generate');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to My App
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This is the home page of your React application with routing setup.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleNavigateToGenerate}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Go to Generate Page
        </Button>
      </Box>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<GenerateStream />} />
    </Routes>
  );
};

export default App;

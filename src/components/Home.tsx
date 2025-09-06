import { Container, Box, Typography, Button } from "@mui/material";
import { env } from '../utils/env';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Home: React.FC = () => {
  const [isTasks, setIsTasks] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${env.apiBaseUrl}/tasks`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }        
        const data = await response.json();
        const hasTasks = data.total_tasks > 0;
        setIsTasks(hasTasks);
        
      } catch (err) {
        console.error('Unexpected error checking if there are ongoing tasks.. ', err)
        setIsTasks(false); 
      } 
    };

    fetchTasks();
  }, []); 

  const handleNavigateToGenerate = () => {
    navigate('/generate');
  };
  const handleNavigateToTasks = () => {
    navigate('/tasks');
  };


  return (
    <Container 
      maxWidth="lg" 
      data-testid="welcome-container"
      role="main" 
      aria-label="Welcome section"
      aria-labelledby="welcome-title" 
      sx={{
        display:'flex',
        flexDirection:'row'
      }}
    >
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'start',
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          gap: 4,
          flexWrap: 'wrap'
        }} 
        data-testid="welcome-box"
        aria-describedby="welcome-description" 
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          data-testid="welcome-title"
          id="welcome-title" 
        >
          Welcome!
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ mb: 4 }} 
          data-testid="welcome-description"
          id="welcome-description" 
          aria-live="polite" 
        >
          This is a tiny image generator built with React, FastAPI server and Stable Diffusion2.1
        </Typography>
      </Box>
      <Box
         sx={{ 
          p: 4, 
          textAlign: 'start',
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          gap: 4,
          flexWrap: 'wrap'
        }}>
         <Button
          size="small"
          onClick={handleNavigateToGenerate}
          variant="contained"
          data-testid="go-to-generate-button"
          aria-label="Go to image generation page" 
          aria-describedby="welcome-description" 
          role="button" 
          tabIndex={0} 
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavigateToGenerate();
            }
            }}
        >
          Go to Generate
        </Button>
        {isTasks && <Button
          size="small"
          variant="contained"
          onClick={handleNavigateToTasks}
          data-testid="go-to-tasks-button"
          aria-label="Go to running tasks page" 
          aria-describedby="welcome-description" 
          role="button" 
          tabIndex={0} 
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavigateToTasks();
            }
            }}
        >
            Go to Tasks
        </Button>}
      </Box>
    </Container>
  );
};
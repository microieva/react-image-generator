import { Container, Box, Typography, Button } from "@mui/material";
import { env } from '../utils/env';
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToGenerate = () => {
    navigate('/generate');
  };
  const handleNavigateToTasks = () => {
    navigate('/tasks');
  };

  return (
    <Container 
      maxWidth="sm" 
      data-testid="welcome-container"
      role="main" 
      aria-label="Welcome section"
      aria-labelledby="welcome-title" 
    >
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
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
          Welcome to My App
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ mb: 4 }} 
          data-testid="welcome-description"
          id="welcome-description" 
          aria-live="polite" 
        >
          This is a tiny image generator built with React client and FastAPI server and Stable Diffusion2.1
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
        {env.isDevelopment && <Button
          variant="contained"
          size="large"
          onClick={handleNavigateToTasks}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
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
import { Container, Box, Typography, Button, Divider } from "@mui/material";
import { env } from '../utils/env';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAnimation } from "../contexts/AnimationContext";
import { useDevice } from "../contexts/DeviceContext";

export const Home: React.FC = () => {
  const [isTasks, setIsTasks] = useState<boolean>(false);
  const [isImages, setIsImages] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>('');
  const navigate = useNavigate();
  const { setAnimationType } = useAnimation();
  const { isDesktop } = useDevice();

  useEffect(() => {
    const fetchTaskTotal = async () => {
      try {
        const response = await fetch(`${env.apiBaseUrl}/tasks`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }        
        const data = await response.json();
        const hasTasks = data.total_tasks > 0;
        setAnimationClass("animate__animated animate__tada")
        setIsTasks(hasTasks);
      } catch (err) {
        console.error('Unexpected error checking if there are ongoing tasks.. ', err)
        setIsTasks(false); 
      } 
    };
    const fetchImageTotal = async () => {
      try {
        const response = await fetch(`${env.apiBaseUrl}/images`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }        
        const data = await response.json();
        const hasImages = data.length > 0;
        setAnimationClass("animate__animated animate__tada")
        setIsImages(hasImages);
      } catch (err) {
        console.error('Unexpected error checking if there are saved images.. ', err)
        setIsImages(false); 
      } 
    };
    fetchTaskTotal();
    fetchImageTotal();
  }, []); 

  const handleNavigateToGenerate = () => {
    if (isDesktop) setAnimationType('slideInRight');
    else {
      setAnimationType('slideInUp');
    }
    navigate('generate');
  };
  const handleNavigateToTasks = () => {
    if (isDesktop) setAnimationType('slideInRight');
    else setAnimationType('slideInUp');
    navigate('/tasks');
  };
   const handleNavigateToImages = () => {
    if (isDesktop) setAnimationType('slideInRight');
    else setAnimationType('slideInUp');
    navigate('/images');
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
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: isDesktop ? 'inherit' : 'space-between',
        height: isDesktop ? 'auto' : '60vh'
      }}
    >
      <Box 
        sx={{ 
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
      <Divider 
        aria-hidden="true" 
        orientation={isDesktop ? 'vertical':'horizontal'}
        variant="middle" 
        flexItem
        sx={{
          mx:isDesktop ? 10 : 0, 
          my: isDesktop ? 0 : 10,
        }}
      />
      <Box
         sx={{ 
          textAlign: 'start',
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: isDesktop ?  'start':'center',
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
          className={animationClass}
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
        {isImages && <Button
          className={animationClass}
          size="small"
          variant="contained"
          onClick={handleNavigateToImages}
          data-testid="go-to-tasks-button"
          aria-label="Go to running tasks page" 
          aria-describedby="welcome-description" 
          role="button" 
          tabIndex={0} 
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavigateToImages();
            }
            }}
          >
            Today's Images
        </Button>}
      </Box>
    </Container>
  );
};

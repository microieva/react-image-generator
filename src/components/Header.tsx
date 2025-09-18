import { AppBar, Toolbar, Box, Button } from "@mui/material"
import ThemeToggle from "./ThemeToggle"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAnimation } from "../contexts/AnimationContext";
import { useDevice } from "../contexts/DeviceContext";


export const Header: React.FC = () => {
  const location = useLocation();
  const [isHomeRoute, setIsHomeRoute] = useState<boolean>(true);
  const navigate = useNavigate();
  const { setAnimationType } = useAnimation();
  const { isDesktop } = useDevice();

  useEffect(()=> {
    setIsHomeRoute(location.pathname === '/')
  })

  const handleGoBack = () => {
    if (location.pathname.endsWith('tasks') || 
        location.pathname.endsWith('generate-stream') || 
        location.pathname.endsWith('generate') ||
        location.pathname.endsWith('images'))
    {
      if (isDesktop) setAnimationType('slideInLeft');
      else setAnimationType('slideInDown');
      navigate('/');

    } else {
      if (isDesktop) setAnimationType('fadeIn');
      else setAnimationType('fadeIn');
      navigate('/tasks');
    }
  };

  return (
    <AppBar 
      position="static"
      sx={{ 
        backgroundColor: 'transparent', 
        backgroundImage: 'none',
        boxShadow: 'none', 
        color: 'inherit', 
      }}
    >
      <Toolbar>
        {!isHomeRoute && 
          <Button
            sx={{ 
              px:2,
              backgroundColor:'none', 
              border:'transparent solid 0.8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'transparent',
                border: 'darkgray solid 0.8px'
              },
              color:'inherit', 
              borderRadius: 15 }}
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            data-testid="generate-go-back-button"
            aria-label="Go back to welcome page" 
            aria-describedby="generate-description" 
            role="button" 
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleGoBack();
              }
            }}
          >
            Back 
          </Button>
        }
        <Box sx={{ flexGrow: 1 }} />
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  )
}
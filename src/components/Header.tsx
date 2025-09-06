import { AppBar, Toolbar, Box, Button } from "@mui/material"
import ThemeToggle from "./ThemeToggle"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header: React.FC = () => {
  const location = useLocation();
  const [isHomeRoute, setIsHomeRoute] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(()=> {
    setIsHomeRoute(location.pathname === '/')
  })

  const handleGoBack = () => {
    if (location.pathname.endsWith('/tasks') || (location.pathname.endsWith('/generate-stream')) || (location.pathname.endsWith('/generate'))) {navigate('/');}
    else navigate('/tasks');
  }

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
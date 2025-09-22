import React from 'react';
import { Box, Container } from '@mui/material';
import Footer from './Footer';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { useDevice } from '../contexts/DeviceContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isMobile } = useDevice();
  const isTasksRoute = location.pathname === '/tasks';
  const isimagesRoute = location.pathname === '/images';

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', 
      }}
    >
      <Header/>  
      <Container 
        component="main" 
        sx={{
          boxSizing: 'border-box',
          flexGrow: 1, 
          opacity: '0.8',
          p:0,
          px: isMobile ? 1 : 0,
          width:'100%',
          overflow:'hidden',
          alignContent: isTasksRoute || isimagesRoute ? 'flex-start': 'center'
        }}
      >
        {children}
      </Container> 
      <Footer /> 
    </Box>
  );
};

export default Layout;
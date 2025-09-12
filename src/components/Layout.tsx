import React from 'react';
import { Box, Container } from '@mui/material';
import Footer from './Footer';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isTasksRoute = location.pathname === '/tasks';

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
          flexGrow: 1, 
          opacity: '0.8',
          alignContent: isTasksRoute ? 'flex-start': 'center'
        }}
      >
        {children}
      </Container> 
      <Footer /> 
    </Box>
  );
};

export default Layout;
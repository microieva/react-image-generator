import React from 'react';
import { Box, Container } from '@mui/material';
import Footer from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
          alignContent:'center'
        }}
      >
        {children}
      </Container> 
      <Footer /> 
    </Box>
  );
};

export default Layout;
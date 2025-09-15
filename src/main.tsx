import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DeviceProvider } from './contexts/DeviceContext';
import CssBaseline from '@mui/material/CssBaseline';
import { App } from './App';
import 'animate.css/animate.min.css';
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DeviceProvider>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </DeviceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
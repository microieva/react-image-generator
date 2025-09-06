import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontFamily: '"Roboto Mono", monospace',
          fontSize: '0.7rem',
          opacity: 0.8,
        }}
      >
        Ieva Vyliaudaite, 2025
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          component={Link}
          href="https://linkedin.com/in/ievavyliaudaite"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          size="small"
          aria-label="LinkedIn"
          sx={{ mx: 0.5 }}
        >
          <LinkedInIcon fontSize="small" />
        </IconButton>

        <IconButton
          component={Link}
          href="https://github.com/microieva/app-image-generator"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          size="small"
          aria-label="GitHub"
          sx={{ mx: 0.5 }}
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
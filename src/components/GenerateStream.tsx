import React from 'react';
import { useGenerate } from '../hooks/useGenerate';
import {
  TextField,
  Button,
  Box,
  LinearProgress,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GenerateStream: React.FC = () => {
  const [prompt, setPrompt] = React.useState('');
  const { 
    loading, 
    //progress, 
    //status, 
    error, 
    data,
    //image, 
    generate, 
    reset } = useGenerate();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await generate(prompt.trim());
    setPrompt(''); 
  };

  return (
    <>
      <Button
        sx={{ pw: 2, m: 4 }}
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
      >
        Back 
      </Button>
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
       <Typography variant="h4" component="h1" gutterBottom>
        Image Generator
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome! This is your dedicated space for content generation.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Describe your image..."
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !prompt.trim()}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>
    </Paper>
       {loading && (
          <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Generating your image, please wait...
                  </Typography>
                 
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {/* {progress}% complete */}
                  </Typography>
                </Box>
          </Paper>
        )}
        {data && (
          <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Box sx={{ mt: 3 }}>

            {data.image && <img 
              src={data.image} 
              alt="Generated" 
              style={{ 
                maxWidth: '100%', 
                borderRadius: 8,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }} 
            />}
            <Button 
              onClick={reset}
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              Reset
            </Button>
          </Box>
          </Paper>
        )}
    </>
  );
};

export default GenerateStream;
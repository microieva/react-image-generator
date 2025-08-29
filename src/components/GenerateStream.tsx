import React, { useEffect } from 'react';
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
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { useCancellableGeneration } from '../hooks/useCancellableGeneration';
import type { GenerationResult } from '../types/api';
//import type { GenerationResponse, SSEProgressEvent } from '../types/api';

const GenerateStream: React.FC = () => {
  const [prompt, setPrompt] = React.useState('');
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  //const [currentTaskId, setCurrentTaskId] = React.useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState<boolean>(false);
  const {
    generate,
    cancel,
    getprogress,
    reset: resetGeneration,
    loading,
    error,
    progress,
    //taskId,
    cancelled,
    status,
  } = useCancellableGeneration();

  const navigate = useNavigate();

  useEffect(()=> {
    setIsSubmitDisabled(loading || !prompt.trim())
  }, [loading, prompt]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitDisabled(true);
    e.preventDefault();
    if (!prompt.trim()) return;

    const result: GenerationResult | null = await generate(prompt.trim());
    if (result && result.image_url) {
      setGeneratedImage(result.image_url);
      setIsSubmitDisabled(true);
    }
  };

  const handleCancel = async () => {
    await cancel();
    setPrompt('');
    setGeneratedImage(null);
    setIsSubmitDisabled(false);
    resetGeneration();
  };

  const handleReset = () => {
    resetGeneration();
    setPrompt('');
    setGeneratedImage(null);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Button
        sx={{ p: 2, m: 4 }}
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
      >
        Back 
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
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
            multiline
            rows={3}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitDisabled}
              fullWidth
            >
              {loading ? `${status}...` : 'Generate Image'}
            </Button>
            {loading &&
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                fullWidth
              >
                Cancel
              </Button> }
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {cancelled && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Generation was cancelled. You can start a new one.
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
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {getprogress()}% complete
            </Typography>
          </Box>
        </Paper>
      )}

      {generatedImage && (
        <Paper elevation={3} sx={{ p: 3, pt: 1, maxWidth: 600, mx: 'auto', my: 4 }}>
          <Box sx={{ 
            my: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <Button 
              onClick={handleReset}
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Generate New
            </Button>
            <Button 
              onClick={handleDownload}
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Download Image
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={generatedImage} 
              alt="Generated" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px',
                objectFit: 'contain'
              }} 
            />
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
            Prompt: {prompt}
          </Typography>
        </Paper>
      )}
    </>
  );
};

export default GenerateStream;
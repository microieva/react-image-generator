import { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  LinearProgress,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { useCancellableGeneration } from '../hooks/useCancellableGeneration';
import type { GenerationResult } from '../types/api';

const GenerateStream: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

  const {
    generate,
    cancel,
    reset: resetGeneration,
    loading,
    error,
    progress,
    cancelled,
    status,
    prompt_str
  } = useCancellableGeneration(id);

  useEffect(()=> {
    setIsSubmitDisabled(loading || !prompt.trim())
  }, [loading, prompt]);

  useEffect( ()=> { 
    id && prompt_str && setPrompt(prompt_str);
  }, [id, prompt_str])

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
    <Container 
      maxWidth="sm" 
      data-testid="generate-container"
      role="main" 
      aria-label="Generate section"
      aria-labelledby="generate-title" 
    >
      <Paper 
        elevation={3} 
        sx={{ p: 3, maxWidth: 600, mx: 'auto' }} 
        data-testid="generate-paper"
         aria-describedby="generate-description" 
         aria-live="polite">
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          data-testid="generate-title"
          id="generate-title" 
        >
          Image Generator
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ mb: 3 }}
          data-testid="generate-description"
          id="generate-description" 
          aria-live="polite" 
        >
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
            role="textbox"
            data-testid="generate-prompt-input"
            aria-label="Image prompt input, describe your image"
            aria-required="true"
            required
            autoFocus
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
                handleSubmit(e);
              }
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2, 
            flexDirection: { xs: 'column', sm: 'row' } }}
          >
            {!error && <Button
              type="submit"
              variant="contained"
              sx={{minWidth:'50%'}}
              disabled={isSubmitDisabled}
              fullWidth
              data-testid="generate-submit-button"
              aria-label="Start generation"
              role="button"
              aria-describedby="generate-description" 
            >
              {loading ? `${status}...` : 'Generate Image'}
            </Button>}
            {loading &&
              <Button
                variant="outlined"
                sx={{maxWidth:'50%'}}
                data-testid="generate-cancel-button"
                color="error"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                fullWidth
                disabled={status === 'cancelling'}
                aria-describedby="generate-description" 
                aria-label="Cancel generation"
                tabIndex={0}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCancel();
                  }
                }}
              >
                Cancel
              </Button> }
            {!cancelled && error &&
              <Button
                type="submit"
                role="button"
                variant="outlined"
                data-testid="generate-retry-button"
                aria-describedby="generate-description" 
                color="error"
                onClick={handleSubmit}
                startIcon={<ReplayIcon />}
                fullWidth
                aria-label="Retry generation"
                tabIndex={0}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
                    handleSubmit(e);
                  }
                }}
              >
                Retry
              </Button> }
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} role="alert" data-testid="alert">
              {error}
            </Alert>
          )}

          {cancelled && (
            <Alert severity="info" sx={{ mt: 2 }} role="info" data-testid="info">
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
              role="progress-bar"
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              data-testid="progress-bar"
              data-cy="progress-bar"
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {progress}% complete
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
              data-testid="generate-reset-button"
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
    </Container>
  );
};

export default GenerateStream;
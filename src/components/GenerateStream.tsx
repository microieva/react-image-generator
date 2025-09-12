import { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  LinearProgress,
  Typography,
  Alert,
  Paper,
  Divider,
  CircularProgress
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
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [animationClass, setAnimationClass] = useState<string>('');
  const [isExiting, setIsExisting] = useState(false);
  
  const {
    getStream,
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
    setIsSubmitDisabled(loading || !prompt.trim());
  }, [loading, prompt]);

  useEffect(()=> { 
    id && prompt_str && setPrompt(prompt_str);
    const getResult = async ()=> {
      const result:GenerationResult | null = await getStream();
      if (result) setGeneratedImage(result.image_url);
    }

    if (id && status ==='completed') {
      getResult();  
      setIsSubmitDisabled(true);
    }
  }, [id, prompt_str, status])

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
    setAnimationClass('animate__animated animate_fadeOutRight');
    setIsExisting(true);
    await cancel();
    setIsSubmitDisabled(false);
    setPrompt('');
    setGeneratedImage(null);
    resetGeneration();
    setIsExisting(false);
  };

  const handleReset = () => {
    setAnimationClass('animate__animated animate_fadeOutRight');
    setIsExisting(true);
    resetGeneration();
    setPrompt('');
    setGeneratedImage(null);
    //setAnimationClass('');
    setIsExisting(false);
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
      data-testid="generate-container"
      role="main" 
      aria-label="Generate section"
      aria-labelledby="generate-title" 
      sx={{
        display:'flex', 
        flexDirection:'row', 
        transition: 'all 0.5s ease-in-out',
        margin: 'auto',
        overflow: 'hidden'
      }}
    >
      <Paper 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          maxWidth:'60vw',
          m: 'auto', 
          flex: loading && !isExiting ? 1 : 2, 
          transition: 'flex 0.5s ease-in-out',
        }} 
        data-testid="generate-paper"
        aria-describedby="generate-description" 
        aria-live="polite"
      >
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
            value={generatedImage ? '' : prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading || Boolean(generatedImage)}
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
            {!error && !generatedImage && <Button
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
            {!error && generatedImage && 
              <>
                <Button 
                  fullWidth
                  onClick={handleReset}
                  sx={{minWidth:'50%'}}
                  variant="contained"
                  role="button"
                  aria-label="Refresh for new generation"
                  data-testid="generate-reset-button"
                  aria-describedby="generate-description" 
                  startIcon={<RefreshIcon />}
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
              </>
            }
            {loading &&
              <Button
                className={isExiting ? animationClass : undefined}
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
        </form>
      </Paper>

      {loading && (<>
        <Divider 
          aria-hidden="true" 
          orientation="vertical" 
          variant="middle" 
          flexItem 
          sx={{
            mx:10,  
            //opacity: loading && !isExiting ? 1 : 0,
            display: loading && !isExiting ? 'block' : 'none',
            transition: 'display 0.4s ease-in-out'
          }}
        />
        <Box 
          className={isExiting ? animationClass : undefined} 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            flex: isExiting ? 0 : 1,
            opacity: isExiting ? 0 : 1,
            minWidth: 0,
            transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
            overflow: 'hidden',
          }}
        >
          <Paper 
            sx={{  
              display: 'flex',
              flexDirection:'column',
              flex: 1,
            }}
          >
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
          </Paper>
        </Box>
      </>
      )}
      {error && !generatedImage && (
        <>
          <Divider aria-hidden="true" orientation="vertical" variant="middle" flexItem sx={{mx:10}}/>
          <Box 
            className={isExiting ? animationClass : undefined} 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              flex: isExiting ? 0 : 1,
              opacity: isExiting ? 0 : 1,
              //minWidth: 0,
              width:'50vw',
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden',
            }}
          > 
              <Alert severity="error" role="alert" data-testid="alert">
                {error}
              </Alert>
          </Box>
        </>
      )}

      {cancelled && (
        <>
          <Divider 
            aria-hidden="true" 
            orientation="vertical" 
            variant="middle" 
            flexItem 
            sx={{
              mx:10, 
              opacity: loading ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out'
            }}
          />
          <Paper 
            elevation={3} 
            sx={{
              m: 'auto', 
              width:'50vw', 
              //flex: loading ? 1/2 : 0,
              // minWidth: 0,
              // transition: 'flex 0.5s ease-in-out, width 0.5s ease-in-out',
              // opacity: loading ? 1 : 0,
              // overflow: 'hidden'
            }} 
          > 
            <Alert severity="info" sx={{ mt: 2 }} role="info" data-testid="info">
              Generation was cancelled. You can start a new one.
            </Alert>
          </Paper>
        </>
      )}

      {status === 'completed' && !error && (
        <>
          <Divider aria-hidden="true" orientation="vertical" variant="middle" flexItem sx={{mx:10}}/>
          <Paper 
            elevation={3} 
            sx={{ 
              m:'auto', 
              width:'50vw', 
              flex: isExiting ? 0 : 1,
              opacity: isExiting ? 0 : 1,
              minWidth: 0,
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden'
            }} 
            className={isExiting ? animationClass : undefined} >  
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              borderRadius: 2,
              flex: isExiting ? 0 : 1,
              opacity: isExiting ? 0 : 1,
              minWidth: 0,
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden',
            }}>
              {!generatedImage && <CircularProgress/>}

              {generatedImage && <img 
                src={generatedImage} 
                alt="Generated" 
                className = "animate__animated animated__pulse"
                style={{ 
                  width: 'auto', 
                  height: '60vh',
                  objectFit: 'contain',
                  borderRadius:5
                }} 
              />}
            </Box>  
            {generatedImage && 
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                Prompt: {prompt}
              </Typography>
            }
          </Paper>
        </>
      )}
    </Container>
  );
};

export default GenerateStream;
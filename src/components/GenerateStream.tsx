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
import { useDevice } from '../contexts/DeviceContext';

const GenerateStream: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [animationClass, setAnimationClass] = useState<string>('');
  const [isExiting, setIsExisting] = useState(false);
  const { isDesktop, isMobile } = useDevice();
  
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
    if (isDesktop) setAnimationClass('animate__animated animate_fadeInRight');
    else setAnimationClass('animate__animated animate_slideInDown');
  }, [loading, prompt]);

   useEffect(()=> {
    if (isDesktop) setAnimationClass('animate__animated animate_fadeOutRight');
    else setAnimationClass('animate__animated animate_slideOutUp');
  }, [isExiting]);

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
    setIsExisting(true);
    await cancel();
    setIsSubmitDisabled(false);
    setPrompt('');
    setGeneratedImage(null);
    resetGeneration();
    setIsExisting(false);
  };

  const handleReset = () => {
    setIsExisting(true);
    resetGeneration();
    setPrompt('');
    setGeneratedImage(null);
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
        paddingY:0,
        display: 'flex', 
        flexDirection: isDesktop ? 'row' : 'column-reverse',
        transition: 'all 0.5s ease-in-out',
        margin: 'auto',
        overflow: 'hidden',
        height: isDesktop ? '60vh' : '85vh',
        justifyContent: isDesktop ? 'inherit':'space-between'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          m: 'auto', 
          maxWidth:isMobile ? '95%': '60%',
          minHeight:'42vh',
          flex: loading && !isExiting ? 2 : 1, 
          transition: 'all 0.5s ease-in-out',
        }} 
        data-testid="generate-paper"
        aria-describedby="generate-description" 
        aria-live="polite"
      >
        <Box 
          display="flex" 
          flexDirection='column'
          sx={{opacity: loading || error || generatedImage ? 0.6 : 1, transition: 'opacity 0.5s ease-in-out',}}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            data-testid="generate-title"
            id="generate-title" 
            sx={{mb:(!loading && !error && !generatedImage) ? '8rem':'inherit'}}
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
            Create a prompt describing your image and expect the unexpected! 
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Describe your image..."
            variant="outlined"
            value={generatedImage ? '' : prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            margin="normal"
            disabled={Boolean(error) || loading || Boolean(generatedImage)}
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
            flexDirection: 'row' }}
          >
            {!error && !generatedImage && 
              <Button
                size="small"
                type="submit"
                variant="contained"
                sx={{
                  minWidth:'50%'
                }}
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
                  size='small'
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
                  fullWidth
                  size='small'
                  onClick={handleDownload}
                  aria-label="Download generated image"
                  data-testid="generate-download-button"
                  aria-describedby="generate-description" 
                  variant="contained"
                  role="button"
                  startIcon={<DownloadIcon />}
                >
                  Download Image
                </Button>
              </>
            }
            {loading &&
              <Button
                className={isExiting ? animationClass : undefined}
                size="small"
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
                size="small"
                data-testid="generate-retry-button"
                aria-describedby="generate-description" 
                color="error"
                onClick={handleReset}
                startIcon={<ReplayIcon />}
                fullWidth
                aria-label="Retry generation"
                tabIndex={0}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isSubmitDisabled) {
                    handleReset();
                  }
                }}
              >
                Retry
              </Button> }
          </Box>
        </form>
      </Box>
     
      {loading && (
        <>
           <Divider 
              aria-hidden="true" 
              orientation={isDesktop ? "vertical" : "horizontal"}
              variant="middle"
              flexItem 
              sx={{
                mx: isDesktop ? 10 : 0, 
                display: !isExiting ? 'block' : 'none',
                transition: 'display 0.5s ease-in-out'
              }}
            />
          <Box 
            className={animationClass}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              opacity: isExiting ? 0 : 1,
              minWidth: 0,
              flex: !isExiting ? 2 : 1, 
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden',
              m:'auto'
            }}
          >
            <Paper 
              sx={{  
                display: 'flex',
                flexDirection:'column',
                flex: 1
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
           <Divider 
              aria-hidden="true" 
              orientation={isDesktop ? "vertical" : "horizontal"}
              variant={"middle"} 
              flexItem 
              sx={{
                mx: isDesktop ? 10 : 0, 
                display: !isExiting ? 'block' : 'none',
                transition: 'display 0.4s ease-in-out'
              }}
            />
          <Box 
            className={isExiting ? animationClass : undefined} 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent:'center',
              flex: !isExiting ? 1 : 2, 
              opacity: isExiting ? 0 : 1,
              margin:'auto',
              width:'auto',
              height: !isDesktop ? '50vh':'inherit',
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
      {status === 'completed' && !error && (
        <>
          <Divider 
            aria-hidden="true" 
            orientation={isDesktop ? "vertical" : "horizontal"}
            variant={"middle"} 
            flexItem 
            sx={{
              mx: isDesktop ? 10 : 0, 
              display: !isExiting ? 'block' : 'none',
              transition: 'display 0.4s ease-in-out'
            }}
          />
          <Box 
            className={isExiting ? animationClass : undefined}  
            sx={{ 
              display:'flex',
              flexDirection:'column',
              flex: isExiting ? 1 : 2, 
              opacity: isExiting ? 0 : 1,
              minWidth: '50%',
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden'
            }} 
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              borderRadius: 2,
              flex: isExiting ? 0 : 1,
              opacity: isExiting ? 0 : 1,
              m:'auto',
              maxHeight: !isDesktop ? '35vh' : '50vh',
              transition: 'flex 0.5s ease-out, opacity 0.5s ease-out',
              overflow: 'hidden',
            }}>
              {!generatedImage && <CircularProgress/>}

            {generatedImage && 
              <img 
                src={generatedImage} 
                alt="Generated image" 
                className = "animate__animated animated__pulse"
                style={{ 
                  objectFit: 'contain',
                  borderRadius:5
                }} 
              />
              }
            </Box>  
            {generatedImage && 
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                Prompt: {prompt}
              </Typography>
            }
          </Box>
        </>
      )}
    </Container>
  );
};

export default GenerateStream;
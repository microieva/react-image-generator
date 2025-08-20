import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import { useGenerate } from '../hooks/useGenerate';

const Generate: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const { generateContent, loading, error, data } = useGenerate();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };
  const handleGenerate = async () => {
    const result = await generateContent(prompt);
    console.log('loading: ', loading)
    console.log('error: ', error)
    console.log('RESULT: ', result)
    console.log('data: ', data)
    if (result?.success) {
      console.log('Generated:', result.data);
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Page
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome to the generate page! This is your dedicated space for content generation.
      </Typography>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
      >
        Go Back to Home
      </Button>
      <div>
         <Box sx={{ p: 3 }}>
      <TextField
        label="Describe your image.."
        variant="outlined"
        value={prompt}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        className="input-field"
      />
    </Box>
      </div>
      <div className="card">
        <Button onClick={() => handleGenerate()} className="button">
          Generate
        </Button>
        <div>
          <h5 className="read-the-docs">prompt:</h5>
          <p className="read-the-docs">{prompt}</p>
        </div>
      </div>
      {true && <div>
        <p className="read-the-docs">{loading}</p>
      </div>}
     {error && <div>
        <p className="read-the-docs">{error}</p>
      </div>}
      {data && <div>
        <p className="read-the-docs">{JSON.stringify(data)}</p>
      </div>}
    </Box>
    
  );
};

export default Generate;
import { useState } from 'react';
import axios from 'axios';
//import type { GenerationResponse } from '../types/api';


export const useGenerate = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<any | null>(null);

  const generateContent = async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return null;
    }

    //setLoading(true);
    setError('');
    setData(null);

    try {
      // const requestData: GenerationRequest = {
      //   prompt: prompt.trim(),
      //   max_tokens: 150,
      //   temperature: 0.7,
      // };

      const response = await axios.post<any>(
        'http://0.0.0.0:8000/generate',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                prompt: prompt.trim(),
                steps: 20,
                guidance_scale: 7.5
            })
        }
      );
      console.log('Response:', response);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Generation failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateContent,
    loading,
    error,
    data,
    reset: () => {
      setError('');
      setData(null);
    },
  };
};
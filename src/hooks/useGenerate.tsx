import { useState } from 'react';
import axios from 'axios';
//import type { GenerationResponse } from '../types/api';


export const useGenerate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<any | null>(null);
  //const [progress, setProgress] = useState<number>(0);

  const generate = async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return null;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      // const requestData: GenerationRequest = {
      //   prompt: prompt.trim(),
      //   max_tokens: 150,
      //   temperature: 0.7,
      // };

      const response = await axios.post<any>(
        //'http://135.181.63.187:8000/generate',
        '/api/generate',
        {
          prompt: prompt.trim(),
          steps: 20,
          guidance_scale: 7.5
        },
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
            }
        }
      );
      
      //setProgress(response.data.progress || 0);
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
    generate,
    loading,
    error,
    data,
    //progress,
    //image,
    //status,
    reset: () => {
      setError('');
      setData(null);
    },
  };
};

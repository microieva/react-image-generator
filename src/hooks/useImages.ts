import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ImageItem, ImagesPagination, ImagesResponse } from '../types/images';
import env from '../utils/env';

export const useImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ImagesPagination>({page: 1, limit: 12});
  const [totalImages, setTotalImages] = useState<number>(0);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<ImagesResponse>(`${env.apiBaseUrl}/images`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      });
      
      setImages(response.data.slice);
      setTotalImages(response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      console.error('Error fetching images:', err);
    } 
    finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  const changePage = ( page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    fetchImages();
  }, [pagination.page, pagination.limit]);

  return {
    images,
    loading,
    error,
    pagination,
    totalImages,
    handleDownload: downloadImage,
    changePage,
    refetch: fetchImages
  };
};
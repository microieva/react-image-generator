import { useState, useEffect, useCallback } from 'react';
import { ImageItem, ImagesPagination, ImagesResponse } from '../types/images';
import { apiClient } from '../config/api';

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
      const response = await apiClient.get<ImagesResponse>(`/images`, {
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
  
  const downloadImage = async (imageUrl: string) => {
  if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
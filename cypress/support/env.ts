export const getEnv = () => {
  return {
    appName: process.env.VITE_APP_NAME || 'Image Generator',
    apiBaseUrl: process.env.API_BASE_URL,
    localUrl: process.env.LOCALHOST_BASE_URL || 'http://localhost:3000',
    debugMode: process.env.VITE_DEBUG_MODE === 'true',
    imageQuality: parseInt(process.env.VITE_IMAGE_QUALITY || '90', 10),
    maxImages: parseInt(process.env.VITE_MAX_IMAGES || '5', 10),
    defaultWidth: parseInt(process.env.VITE_DEFAULT_WIDTH || '512', 10),
    defaultHeight: parseInt(process.env.VITE_DEFAULT_HEIGHT || '512', 10)
  };
};

export const env = getEnv();
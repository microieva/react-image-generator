export interface EnvironmentConfig {
  appName: string
  appVersion: string
  
  apiBaseUrl: string
  
  // Feature flags
  debugMode: boolean
  
  imageQuality: number
  maxImages: number
  defaultWidth: number
  defaultHeight: number
  
  // Environment detection
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean

  environment: string
}

export const env: EnvironmentConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Image Generator',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://135.181.63.159:8000',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  imageQuality: parseInt(import.meta.env.VITE_IMAGE_QUALITY || '90'),
  maxImages: parseInt(import.meta.env.VITE_MAX_IMAGES || '5'),
  defaultWidth: parseInt(import.meta.env.VITE_DEFAULT_WIDTH || '512'),
  defaultHeight: parseInt(import.meta.env.VITE_DEFAULT_HEIGHT || '512'),
  
  get isDevelopment(): boolean {
    return import.meta.env.MODE === 'development'
  },
  get isProduction(): boolean {
    return import.meta.env.MODE === 'production'
  },
  get isTest(): boolean {
    return import.meta.env.MODE === 'test'
  },
  
  get environment(): string {
    return import.meta.env.MODE
  }
}

if (env.isDevelopment) {
  console.log('🚀 Environment:', env.environment)
  console.log('🔧 Config:', {
    apiBaseUrl: env.apiBaseUrl,
    debugMode: env.debugMode,
    imageQuality: env.imageQuality,
    maxImages: env.maxImages
  })
}

export default env
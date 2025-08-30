import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import webpackOptions from './webpack.config';
import {env} from '../src/utils/env';

export default defineConfig({
  e2e: {
    baseUrl: env.apiBaseUrl || 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // Enable TypeScript support
      on('file:preprocessor', webpackPreprocessor({
        webpackOptions,
        watchOptions: {}
      }));
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts'
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true
});
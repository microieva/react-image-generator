import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  e2e: {
    baseUrl: process.env.LOCALHOST_BASE_URL || 'http://localhost:3001',
    setupNodeEvents(on, config) {
      return config;
    },
    //watchForFileChanges: false,
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true
});
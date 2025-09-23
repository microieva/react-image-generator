# 🎨 AI Image Generator - Frontend

A modern React-based frontend for generating AI-powered images from text prompts. 
[Image Generator Live](https://react-image-generator-kappa.vercel.app/)

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **AI-Powered Generation**: Create images from text descriptions using Stable Diffusion
- Real-time Progress**: Live progress tracking during image generation
- **Clean UI**: Material-UI design with responsive layout
- **Instant Deployment**: CI/CD via Vercel with zero configuration
- **Mobile Friendly**: Responsive design that works on all devices

## Tech Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **HTTP Client**: Axios for API communication
- **Deployment**: Vercel
- **State Management**: React Hooks (useState, useCallback, useMemo & custom hooks)
- **Build Tool**: Vite 

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/react-image-generator.git
   cd react-image-generator
   ```
2. **Clone the repository**

    ```bash
   npm install
   ```
3. **Configure environment variables**

    ```bash
   cp .env.example .env
   ```
   Edit .env:
     ```bash
    VITE_API_BASE_URL=http://localhost:8000  # For local development
    VITE_API_BASE_URL=/api                   # For production (Vercel proxy)  
   ```
4. **Start development server**

     ```bash
   npm run dev
   ```
   Opens at: http://localhost:5173


## Project Structure
  ```bash
  src/
  ├── App.tsx               # App component
  ├── main.tsx              # DOM rendered
  ├── vite-env.d.ts         # Vite
  ├── components/           # Reusable components
  │   ├── AnimatedPage.tsx  # Wrapper for all routes for routing effects using animate.css
  │   ├── Footer.tsx        # Application footer with credentials
  │   ├── GenerateStream/   # Image generation interface
  │   ├── Header.tsx        # Application header with theme toggle and go-back navigation  
  │   ├── Home.tsx          # Landing page view with navigation to generate, tasks & image collection
  │   ├── Images.tsx        # Image collection view with pagination
  │   ├── Layout.tsx        # Page view wrapper
  │   ├── Tasks.tsx         # Table view with tasks with real-time progress & cancel and delete features
  │   ├── ThemeToggle.tsx   # UI Theme switch handler 
  ├── hooks/                # Custom React hooks
  │   ├── useCancellableGeneration.ts    # Handles image generation and cancellation logic, passes state variables 
  │   ├── useDateFormatting.tsx   # Handles dates
  │   ├── useImages.tsx     # Handles fetching and displaying image collection
  │   └── useTasks.tsx      # Handles task table features
  ├── types/                # TypeScript definitions
  │   └── api.ts            # API type definitions
  ├── styles/               # Global styles
  │   ├── App.css   
  │   ├── index.css         
  │   └── theme.ts          # MUI styling dark & light themes     
  └── utils/
      └── env.ts            # Vite environment settings    
  ```

## Usage

1. Enter a prompt describing the image you want to generate

2. Click "Generate" to start the AI process

3. Cancel generation any time, or, download generated image

4. View and download images from collection

## Acknowledgments

- [Stable Diffusion](https://stability.ai/stable-image) by [Stability AI](https://stability.ai/) for image generation

- [Material-UI]() for the component library

- [Vercel](https://vercel.com/) for seamless deployment

- [DataCrunch](https://datacrunch.io/) for GPU infrastructure 
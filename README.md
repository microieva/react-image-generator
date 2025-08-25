# 🎨 AI Image Generator - Frontend

A modern React-based frontend for generating AI-powered images from text prompts. **This interface was originally designed to connect to a DataCrunch GPU instance**, but currently requires a local backend server for image generation.

## ⚠️ Current Setup
**Local Development Only**: This frontend now connects to a local FastAPI backend server that you must run on your machine. The backend handles the AI processing using Stable Diffusion model. [See details](https://github.com/microieva/image-generator)

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
- **State Management**: React Hooks (useState, useCallback)
- **Build Tool**: Vite (optional) or Create React App

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
  ├── App.tsx             # App component
  ├── main.tsx            # DOM rendered
  ├── vite-env.d.ts       # Vite
  ├── components/         # Reusable components
  │   ├── GenerateStream/ # Image generation interface
  ├── hooks/              # Custom React hooks
  │   └── useGenerate.ts  # Image generation logic
  ├── types/              # TypeScript definitions
  │   └── api.ts          # API type definitions
  ├── styles/             # Global styles
  └── utils/              # Utility functions
  ```

## Usage

1. Enter a prompt describing the image you want to generate

2. Click "Generate" to start the AI process

## Acknowledgments

 - [Stable Diffusion](https://stability.ai/stable-image) by [Stability AI](https://stability.ai/) for image generation

 - [Material-UI]() for the component library

- [Vercel](https://vercel.com/) for seamless deployment

- [DataCrunch](https://datacrunch.io/) for GPU infrastructure 
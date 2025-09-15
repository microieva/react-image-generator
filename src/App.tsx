import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import GenerateStream from './components/GenerateStream';
import { Tasks } from './components/Tasks';
import { Home } from './components/Home';
import Layout from './components/Layout';
import AnimatedPage from './components/AnimatedPage';
import { AnimationProvider } from './contexts/AnimationContext';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimationProvider defaultAnimation="fadeInLeft">
      <Layout>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          } />
          <Route path="/generate-stream/:id" element={
            <AnimatedPage>
              <GenerateStream />
            </AnimatedPage>
          } />
          <Route path="/generate" element={
            <AnimatedPage>
              <GenerateStream />
            </AnimatedPage>
          } />
          <Route path="/tasks" element={
            <AnimatedPage>
              <Tasks />
            </AnimatedPage>
          } />
        </Routes>
      </Layout>
    </AnimationProvider>
  );
};
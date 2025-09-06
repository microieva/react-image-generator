import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GenerateStream from './components/GenerateStream';
import { Tasks } from './components/Tasks';
import { Home } from './components/Home';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-stream/:id" element={<GenerateStream />} />
        <Route path="/generate" element={<GenerateStream />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Layout>
  );
};

export default App;

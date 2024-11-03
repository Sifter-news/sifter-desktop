import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/AuthProvider';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ProjectView from '@/pages/ProjectView';
import AccountPage from '@/pages/AccountPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
          <Toaster 
            position="bottom-center" 
            offset="16"
            expand={false}
            richColors
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
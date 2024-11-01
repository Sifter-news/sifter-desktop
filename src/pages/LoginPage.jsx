import React from 'react';
import { LoginForm, SocialLoginButtons } from '@/components/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#594BFF]">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      ></div>
      <div className="bg-white p-8 rounded-lg shadow-md w-96 z-10">
        <div className="flex justify-center mb-6">
          <img 
            src="https://lov-p-3964558a-5b48-4155-a181-8d109765ccfa.fly.dev/favicon.ico"
            alt="Sifter Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login to Sifter</h2>
        <LoginForm />
        <SocialLoginButtons />
        <div className="text-center mt-4">
          <a 
            href="#" 
            onClick={handleSignUp}
            className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
          >
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
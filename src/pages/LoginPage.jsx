import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LoginPage = () => {
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
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt="Sifter Logo" />
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login to Sifter</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default LoginPage;
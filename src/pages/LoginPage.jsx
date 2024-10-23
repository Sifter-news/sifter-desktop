import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Store default credentials in localStorage if not present
    if (!localStorage.getItem('defaultEmail')) {
      localStorage.setItem('defaultEmail', 'admin@sifter.news');
      localStorage.setItem('defaultPassword', 'admin123');
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Error",
          description: "Failed to check authentication status. Please try again.",
          variant: "destructive",
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/');
        }
      }
    );

    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleAuthError = (error) => {
    toast({
      title: "Authentication Error",
      description: "Invalid credentials. Please try again with email: admin@sifter.news and password: admin123",
      variant: "destructive",
    });
  };

  // Custom styles to inject the default credentials
  const customStyles = {
    input: `
      #auth-sign-in input[name="email"] { 
        background-image: none !important;
      }
      #auth-sign-in input[name="password"] {
        background-image: none !important;
      }
    `,
    defaultValues: {
      email: localStorage.getItem('defaultEmail') || 'admin@sifter.news',
      password: localStorage.getItem('defaultPassword') || 'admin123',
    },
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
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt="Sifter Logo" />
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login to Sifter</h2>
        <div className="text-sm text-center text-gray-600 mb-4">
          Use these credentials:<br/>
          Email: {customStyles.defaultValues.email}<br/>
          Password: {customStyles.defaultValues.password}
        </div>
        <style>{customStyles.input}</style>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              input: {
                color: 'black',
              }
            }
          }}
          theme="light"
          providers={[]}
          onlyThirdPartyProviders={false}
          redirectTo={window.location.origin}
          onError={handleAuthError}
          defaultValues={customStyles.defaultValues}
        />
      </div>
    </div>
  );
};

export default LoginPage;
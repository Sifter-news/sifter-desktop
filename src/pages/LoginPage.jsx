import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const signIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'john.ferreira@example.com',
        password: 'password123'
      });

      if (error) {
        // If login fails, create the account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'john.ferreira@example.com',
          password: 'password123',
          options: {
            data: {
              full_name: 'John Ferreira',
            }
          }
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: "Failed to create account",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: "Logged in as John Ferreira",
      });
      navigate('/');
    };

    signIn();
  }, [navigate, toast]);

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
        <h2 className="text-2xl font-bold text-center mb-6">Logging in...</h2>
      </div>
    </div>
  );
};

export default LoginPage;
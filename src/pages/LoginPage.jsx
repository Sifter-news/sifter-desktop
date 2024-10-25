import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { Twitter } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          toast.error('Invalid email or password. Please try again.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', data.user.id)
        .single();

      if (!profile && !profileError) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: email.split('@')[0],
              email: email,
            }
          ]);
        
        if (insertError) throw insertError;
      }

      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast.error('Twitter login failed: ' + error.message);
      }
    } catch (error) {
      toast.error('Failed to initialize Twitter login');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;

      toast.success('Check your email to confirm your account');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleTwitterLogin}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleSignUp}
            disabled={loading}
            type="button"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
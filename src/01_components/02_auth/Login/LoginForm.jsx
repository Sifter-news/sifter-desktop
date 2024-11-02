/**
 * @file LoginForm.jsx
 * @description Login form component for user authentication
 * 
 * Potential improvements:
 * - Add social login options
 * - Add remember me functionality
 * - Add 2FA support
 * - Add password strength indicator
 * - Add login attempt limiting
 * - Add device fingerprinting
 * - Add captcha for security
 */

import React from 'react';
import { useAuth } from '@/components/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const LoginForm = () => {
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await signIn({
        email: formData.get('email'),
        password: formData.get('password')
      });
      toast.success('Successfully logged in');
    } catch (error) {
      toast.error('Failed to log in');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
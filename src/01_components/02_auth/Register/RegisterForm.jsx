/**
 * @file RegisterForm.jsx
 * @description Registration form component for creating new user accounts
 * 
 * Potential improvements:
 * - Add password strength meter
 * - Add social registration options
 * - Add email verification step
 * - Add terms and conditions checkbox
 * - Add progressive form steps
 * - Add organization signup flow
 * - Add referral code support
 */

import React from 'react';
import { useAuth } from '@/components/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const RegisterForm = () => {
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signUp({
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username')
      });
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      toast.error('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username"
          name="username"
          required
          placeholder="Choose a username"
        />
      </div>

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
          placeholder="Choose a password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm your password"
        />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
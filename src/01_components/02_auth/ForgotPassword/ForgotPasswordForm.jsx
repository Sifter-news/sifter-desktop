/**
 * @file ForgotPasswordForm.jsx
 * @description Form component for requesting a password reset
 * 
 * Potential improvements:
 * - Add security questions
 * - Add rate limiting
 * - Add alternative recovery methods
 * - Add account lockout protection
 * - Add 2FA bypass flow
 * - Add account recovery documentation
 * - Add support contact information
 */

import React, { useState } from 'react';
import { useAuth } from '@/components/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const ForgotPasswordForm = () => {
  const { resetPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      toast.error('Failed to send reset instructions');
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email address"
        />
      </div>

      <Button type="submit" className="w-full">
        Send Reset Instructions
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
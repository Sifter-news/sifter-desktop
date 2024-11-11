import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPasswordForm = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the link to reset your password.
        </p>
        <Link 
          to="/login"
          className="text-blue-600 hover:text-blue-800 block mt-4"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email address"
          disabled={loading}
        />
      </div>

      <div className="text-sm text-center">
        Remember your password?{' '}
        <Link 
          to="/login"
          className="text-blue-600 hover:text-blue-800"
        >
          Sign in
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
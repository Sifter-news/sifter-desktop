import React from 'react';
import { Button } from "@/components/ui/button";
import { Twitter } from 'lucide-react';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SocialLoginButtons = () => {
  const navigate = useNavigate();

  const handleTwitterLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}`,
          scopes: 'tweet.read users.read'
        }
      });

      if (error) {
        toast.error('Twitter login failed: ' + error.message);
        return;
      }

      if (!data.url) {
        toast.error('Failed to get authorization URL from Twitter');
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to initialize Twitter login');
    }
  };

  return (
    <>
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
    </>
  );
};

export default SocialLoginButtons;
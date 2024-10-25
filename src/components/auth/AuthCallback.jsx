import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
                email: session.user.email,
              }
            ]);

          if (insertError) {
            toast.error('Failed to create profile');
          }
        }

        toast.success('Successfully signed in!');
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
};

export default AuthCallback;
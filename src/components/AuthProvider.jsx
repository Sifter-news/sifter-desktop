import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthError = async () => {
    // Clear all auth data
    await supabase.auth.signOut();
    setUser(null);
    
    // Clear local storage
    localStorage.clear();
    
    // Only redirect to login if not already there
    if (location.pathname !== '/login') {
      navigate('/login');
      toast.error('Session expired. Please sign in again.');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          await handleAuthError();
          return;
        }

        if (!session) {
          // No active session
          await handleAuthError();
          return;
        }

        // Verify the session is still valid
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User verification error:', userError);
          await handleAuthError();
          return;
        }

        if (!currentUser) {
          await handleAuthError();
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        await handleAuthError();
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null);
          toast.success('Successfully signed in!');
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          navigate('/login');
          toast.success('Signed out successfully');
          break;
          
        case 'TOKEN_REFRESHED':
          setUser(session?.user ?? null);
          break;
          
        case 'USER_UPDATED':
          setUser(session?.user ?? null);
          break;
          
        case 'USER_DELETED':
          await handleAuthError();
          break;
          
        case 'INITIAL_SESSION':
          setUser(session?.user ?? null);
          break;
          
        default:
          // Handle unknown events
          console.log('Unhandled auth event:', event);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const value = {
    signUp: async (data) => {
      try {
        const { error } = await supabase.auth.signUp(data);
        if (error) throw error;
        toast.success('Check your email to confirm your account');
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    
    signIn: async (data) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          ...data,
          options: {
            refreshToken: true,
          }
        });
        if (error) throw error;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
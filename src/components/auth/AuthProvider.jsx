import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
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
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.clear();
      
      if (location.pathname !== '/login') {
        navigate('/login');
        toast.error('Session expired. Please sign in again.');
      }
    } catch (error) {
      console.error('Error during auth error handling:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          await handleAuthError();
          return;
        }

        if (!session) {
          setLoading(false);
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }

        // Verify session is still valid
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          console.error('User verification error:', userError);
          await handleAuthError();
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
        await handleAuthError();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
            toast.success('Successfully signed in!');
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          navigate('/login');
          toast.success('Signed out successfully');
          break;
          
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user);
          }
          break;
          
        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user);
          }
          break;
          
        case 'USER_DELETED':
          await handleAuthError();
          break;
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const value = {
    signUp: async (data) => {
      try {
        const { error } = await supabase.auth.signUp({
          ...data,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: data.email?.split('@')[0]
            }
          }
        });
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
            persistSession: true
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

export default AuthProvider;
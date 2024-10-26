import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Clear any invalid session data
          await supabase.auth.signOut();
          setUser(null);
          navigate('/login');
          return;
        }

        if (!session) {
          setUser(null);
          navigate('/login');
          return;
        }

        // Verify the session is still valid
        const { data: { user: currentUser }, error: refreshError } = await supabase.auth.getUser();
        
        if (refreshError || !currentUser) {
          console.error('Session refresh error:', refreshError);
          await supabase.auth.signOut();
          setUser(null);
          navigate('/login');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        await supabase.auth.signOut();
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
        toast.success('Signed out successfully');
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
        const { error } = await supabase.auth.signInWithPassword(data);
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
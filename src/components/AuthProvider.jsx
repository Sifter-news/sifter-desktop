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
    await supabase.auth.signOut();
    setUser(null);
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
          setUser(null);
          if (location.pathname !== '/login' && 
              location.pathname !== '/signup' && 
              !location.pathname.startsWith('/auth/callback')) {
            navigate('/login');
          }
          return;
        }

        // Attempt to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          await handleAuthError();
          return;
        }

        setUser(refreshData.user ?? session.user);
      } catch (error) {
        console.error('Auth error:', error);
        await handleAuthError();
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

export default AuthProvider;
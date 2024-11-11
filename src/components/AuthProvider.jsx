import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to clean up auth state
  const cleanupAuth = async () => {
    setUser(null);
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('sb-access-token');
  };

  // Handle auth errors consistently
  const handleAuthError = async (error, customMessage) => {
    console.error('Auth error:', error);
    await cleanupAuth();
    
    if (error?.message?.includes('JWT')) {
      setSessionExpired(true);
      toast.error('Your session has expired. Please sign in again.');
    } else {
      toast.error(customMessage || error?.message || 'An authentication error occurred');
    }
    
    if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          await cleanupAuth();
          setLoading(false);
          if (!location.pathname.startsWith('/auth/') && location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/login');
          }
          return;
        }

        // Verify the session is still valid
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          throw userError || new Error('User session invalid');
        }

        setUser(currentUser);
        setSessionExpired(false);
      } catch (error) {
        await handleAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
            setSessionExpired(false);
            toast.success('Successfully signed in!');
            navigate('/');
          }
          break;
          
        case 'SIGNED_OUT':
          await cleanupAuth();
          navigate('/login');
          toast.success('Signed out successfully');
          break;
          
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user);
            setSessionExpired(false);
          }
          break;
          
        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user);
          }
          break;
          
        case 'USER_DELETED':
          await cleanupAuth();
          navigate('/login');
          toast.info('Account deleted');
          break;
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Auth methods with proper error handling
  const signUp = async ({ email, password, ...metadata }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      });
      
      if (error) throw error;
      
      toast.success('Please check your email to confirm your account');
      navigate('/login');
    } catch (error) {
      handleAuthError(error, 'Failed to create account');
      throw error;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
    } catch (error) {
      handleAuthError(error, 'Invalid login credentials');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await cleanupAuth();
    } catch (error) {
      handleAuthError(error, 'Error signing out');
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      handleAuthError(error, 'Failed to send reset instructions');
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      navigate('/');
    } catch (error) {
      handleAuthError(error, 'Failed to update password');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    sessionExpired,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
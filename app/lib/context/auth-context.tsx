'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

const AuthContext = createContext<{ 
  session: Session | null;
  user: User | null;
  signOut: () => void;
  loading: boolean;
}>({ 
  session: null, 
  user: null,
  signOut: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        // SECURITY FIX: Don't log sensitive auth errors to console in production
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching user:', error);
        }
      }
      if (mounted) {
        setUser(data.user ?? null);
        setSession(null);
        setLoading(false);
        // SECURITY FIX: Remove sensitive auth logging in production
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: Initial user loaded', data.user?.id);
        }
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // SECURITY FIX: Remove sensitive auth state logging in production
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Auth state changed', _event, session?.user?.id);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // SECURITY FIX: Remove sensitive user data logging in production
  if (process.env.NODE_ENV === 'development') {
    console.log('AuthContext: user', user?.id);
  }
  return (
    <AuthContext.Provider value={{ session, user, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

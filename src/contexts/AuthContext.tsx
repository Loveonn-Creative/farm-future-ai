import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  phone: string | null;
  display_name: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  primary_crops: string[] | null;
  total_land_bigha: number | null;
  language_preference: string;
}

interface Subscription {
  id: string;
  plan_type: string;
  is_active: boolean;
  activated_at: string | null;
  expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  }, []);

  const fetchSubscription = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data && data.expires_at && new Date(data.expires_at) < new Date()) {
      setSubscription(null);
    } else {
      setSubscription(data);
    }
  }, []);

  const migrateSessionScans = useCallback(async (userId: string) => {
    const sessionId = localStorage.getItem("datakhet_session");
    if (!sessionId) return;

    await supabase
      .from("soil_scans")
      .update({ user_id: userId })
      .eq("session_id", sessionId)
      .is("user_id", null);
  }, []);

  // Set up auth listener BEFORE getting session
  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            await fetchProfile(currentUser.id);
            await fetchSubscription(currentUser.id);
            if (event === "SIGNED_IN") {
              await migrateSessionScans(currentUser.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setLoading(false);
    });

    return () => authSub.unsubscribe();
  }, [fetchProfile, fetchSubscription, migrateSessionScans]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, phone?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { phone: phone || "" },
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);
    if (!error) await fetchProfile(user.id);
    return { error: error?.message ?? null };
  };

  const refreshSubscription = async () => {
    if (user) await fetchSubscription(user.id);
  };

  const isPremium = !!subscription?.is_active && subscription?.plan_type !== 'free';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        isAuthenticated: !!user,
        isPremium,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

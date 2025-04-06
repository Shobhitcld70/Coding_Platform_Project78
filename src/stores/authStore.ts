import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  linkSocialAccount: (provider: 'github' | 'twitter' | 'linkedin') => Promise<void>;
  unlinkSocialAccount: (provider: 'github' | 'twitter' | 'linkedin', password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      // First try to sign up with auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account.');
      }

      // Then create the user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName,
          },
        ])
        .single();

      if (profileError) {
        // If profile creation fails, clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error('Failed to create user profile. Please try again.');
      }

      set({ user: authData.user, session: authData.session });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete signup. Please try again.');
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data received. Please try again.');
      }

      set({ user: data.user, session: data.session });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in. Please try again.');
    }
  },

  signInWithGithub: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with GitHub. Please try again.');
    }
  },

  signInWithTwitter: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Twitter. Please try again.');
    }
  },

  signInWithLinkedIn: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with LinkedIn. Please try again.');
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out. Please try again.');
    }
  },

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        set({ user: session.user, session });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, session });
    });
  },

  linkSocialAccount: async (provider: 'github' | 'twitter' | 'linkedin') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || `Failed to link ${provider} account. Please try again.`);
    }
  },

  unlinkSocialAccount: async (provider: 'github' | 'twitter' | 'linkedin', password: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) throw new Error('No user found');

      // Get current identities
      const identities = user.identities || [];
      const providerIdentity = identities.find(identity => identity.provider === provider);

      if (!providerIdentity) {
        throw new Error(`No linked ${provider} account found`);
      }

      // Verify the password before unlinking
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password,
      });

      if (signInError) {
        throw new Error('Invalid password. Please verify your password and try again.');
      }

      // Update the user to ensure they can still log in with email/password
      const { error: updateError } = await supabase.auth.updateUser({
        email: user.email,
        password: password, // Keep the same password
      });

      if (updateError) throw updateError;

      // Sign out to complete the unlinking process
      await supabase.auth.signOut();
      set({ user: null, session: null });

      return true;
    } catch (error: any) {
      console.error('Error unlinking account:', error);
      throw new Error(error.message || `Failed to unlink ${provider} account. Please try again.`);
    }
  },
}));
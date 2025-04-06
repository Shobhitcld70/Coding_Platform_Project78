import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { LeaderboardUser, Badge, PointTransaction } from '../types';

interface LeaderboardState {
  users: LeaderboardUser[];
  userPoints: number;
  userLevel: number;
  userBadges: Badge[];
  userTransactions: PointTransaction[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
  fetchUserStats: (userId: string) => Promise<void>;
  fetchUserTransactions: (userId: string) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  users: [],
  userPoints: 0,
  userLevel: 0,
  userBadges: [],
  userTransactions: [],
  loading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(100);

      if (error) throw error;

      // Transform the data to match our types
      const leaderboardUsers: LeaderboardUser[] = data.map(user => ({
        id: user.id,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        points: user.points,
        level: user.level,
        rank: user.rank,
        snippets_count: user.snippets_count,
        comments_count: user.comments_count,
        badges: user.badges || [],
        badges_count: user.badges_count
      }));

      set({ users: leaderboardUsers, loading: false });
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchUserStats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // Fetch user points and level
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points, level')
        .eq('user_id', userId)
        .single();

      if (pointsError && pointsError.code !== 'PGRST116') throw pointsError;

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          badges (
            id,
            name,
            description,
            image_url
          )
        `)
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      const badges: Badge[] = badgesData?.map(item => ({
        id: item.badges.id,
        name: item.badges.name,
        description: item.badges.description,
        image_url: item.badges.image_url
      })) || [];

      set({
        userPoints: pointsData?.points || 0,
        userLevel: pointsData?.level || 1,
        userBadges: badges,
        loading: false
      });
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchUserTransactions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transactions: PointTransaction[] = data.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        action_type: tx.action_type,
        created_at: tx.created_at
      }));

      set({ userTransactions: transactions, loading: false });
    } catch (error: any) {
      console.error('Error fetching user transactions:', error);
      set({ error: error.message, loading: false });
    }
  }
}));
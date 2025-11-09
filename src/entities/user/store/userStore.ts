import { create } from 'zustand';
import { UserProfile, MeSummary } from '../model/types';

interface UserState {
  profile: UserProfile | null;
  summary: MeSummary | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  setSummary: (summary: MeSummary) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  summary: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearUser: () => set({ profile: null, summary: null, error: null }),
}));

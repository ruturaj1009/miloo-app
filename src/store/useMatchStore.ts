import { create } from 'zustand';
import { MatchSummary } from '../types/interaction.types';
import { UserProfile } from '../types/profile.types';
import { interactionApi } from '../api/interactionApi';
import { MOCK_MATCHES } from '../api/mock/mockData';

interface MatchState {
  matches: MatchSummary[];
  isLoading: boolean;
  error: string | null;
  
  // SCR-04 Match celebration modal state
  isCelebrationVisible: boolean;
  celebrationProfile: UserProfile | null;
  celebrationMatchId: string | null;

  fetchMatches: () => Promise<void>;
  addMatch: (match: MatchSummary) => void;
  triggerMatchCelebration: (profile: UserProfile, matchId: string) => void;
  dismissMatchCelebration: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matches: [...MOCK_MATCHES],
  isLoading: false,
  error: null,
  isCelebrationVisible: false,
  celebrationProfile: null,
  celebrationMatchId: null,

  fetchMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await interactionApi.getMatches();
      set({ matches: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addMatch: (newMatch: MatchSummary) => {
    set((state) => ({
      matches: [newMatch, ...state.matches.filter((m) => m.match_id !== newMatch.match_id)],
    }));
  },

  triggerMatchCelebration: (profile: UserProfile, matchId: string) => {
    set({
      isCelebrationVisible: true,
      celebrationProfile: profile,
      celebrationMatchId: matchId,
    });
  },

  dismissMatchCelebration: () => {
    set({
      isCelebrationVisible: false,
      celebrationProfile: null,
      celebrationMatchId: null,
    });
  },
}));

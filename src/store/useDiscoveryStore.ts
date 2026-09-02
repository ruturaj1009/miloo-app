import { create } from 'zustand';
import { UserProfile } from '../types/profile.types';
import { SwipeAction, MatchSummary } from '../types/interaction.types';
import { peopleApi } from '../api/peopleApi';
import { interactionApi } from '../api/interactionApi';
import { useMatchStore } from './useMatchStore';

interface DiscoveryState {
  profiles: UserProfile[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  swipeHistory: { profile: UserProfile; action: SwipeAction }[];

  fetchDiscoveryFeed: () => Promise<void>;
  swipe: (action: SwipeAction) => Promise<MatchSummary | null>;
  undoSwipe: () => void;
  resetDeck: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  profiles: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  swipeHistory: [],

  fetchDiscoveryFeed: async () => {
    set({ isLoading: true, error: null });
    try {
      const feed = await peopleApi.getDiscoveryFeed();
      set({ profiles: feed, currentIndex: 0, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  swipe: async (action: SwipeAction) => {
    const { profiles, currentIndex, swipeHistory } = get();
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return null;

    // Advance deck index optimistically
    set({
      currentIndex: currentIndex + 1,
      swipeHistory: [...swipeHistory, { profile: currentProfile, action }],
    });

    try {
      const response = await interactionApi.recordSwipe({
        target_user_id: currentProfile.user_id,
        action,
      });

      if (response.is_match && response.match) {
        useMatchStore.getState().addMatch(response.match);
        useMatchStore.getState().triggerMatchCelebration(currentProfile, response.match.match_id);
        return response.match;
      }
      return null;
    } catch (err) {
      console.error('Failed to record swipe', err);
      return null;
    }
  },

  undoSwipe: () => {
    const { currentIndex, swipeHistory } = get();
    if (currentIndex > 0 && swipeHistory.length > 0) {
      const newHistory = [...swipeHistory];
      newHistory.pop();
      set({
        currentIndex: currentIndex - 1,
        swipeHistory: newHistory,
      });
    }
  },

  resetDeck: () => {
    get().fetchDiscoveryFeed();
  },
}));

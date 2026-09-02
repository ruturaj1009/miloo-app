import { create } from 'zustand';
import { InterestedInType } from '../types/profile.types';

interface SettingsState {
  maxDistanceKm: number;
  ageMinPref: number;
  ageMaxPref: number;
  interestedIn: InterestedInType;
  globalMode: boolean;
  pushNotifications: boolean;
  messagePreview: boolean;
  soundEffects: boolean;
  hapticsEnabled: boolean;
  isSaving: boolean;

  setMaxDistanceKm: (val: number) => void;
  setAgeRange: (min: number, max: number) => void;
  setInterestedIn: (pref: InterestedInType) => void;
  toggleGlobalMode: () => void;
  togglePushNotifications: () => void;
  toggleSoundEffects: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  maxDistanceKm: 35,
  ageMinPref: 21,
  ageMaxPref: 32,
  interestedIn: 'WOMEN',
  globalMode: false,
  pushNotifications: true,
  messagePreview: true,
  soundEffects: true,
  hapticsEnabled: true,
  isSaving: false,

  setMaxDistanceKm: (val) => set({ maxDistanceKm: val }),
  setAgeRange: (min, max) => set({ ageMinPref: min, ageMaxPref: max }),
  setInterestedIn: (pref) => set({ interestedIn: pref }),
  toggleGlobalMode: () => set((state) => ({ globalMode: !state.globalMode })),
  togglePushNotifications: () => set((state) => ({ pushNotifications: !state.pushNotifications })),
  toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
}));

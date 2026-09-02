import { create } from 'zustand';
import { UserProfile, UpdateProfileRequest, ProfileMedia } from '../types/profile.types';
import { peopleApi } from '../api/peopleApi';
import { CURRENT_USER } from '../api/mock/mockData';

interface ProfileState {
  profile: UserProfile;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  addPhoto: (uri: string) => Promise<void>;
  removePhoto: (mediaId: string) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: { ...CURRENT_USER },
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await peopleApi.getMyProfile();
      set({ profile: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await peopleApi.updateMyProfile(data);
      set({ profile: updated, isSaving: false });
    } catch (err: any) {
      set({ error: err.message, isSaving: false });
    }
  },

  addPhoto: async (uri: string) => {
    const currentPhotos = get().profile.photos;
    if (currentPhotos.length >= 6) return;

    const newPhoto: ProfileMedia = {
      media_id: `m_temp_${Date.now()}`,
      user_id: get().profile.user_id,
      r2_object_key: `photos/${Date.now()}.jpg`,
      media_url: uri,
      display_order: currentPhotos.length,
      created_at: new Date().toISOString(),
    };

    const updatedPhotos = [...currentPhotos, newPhoto];
    set((state) => ({
      profile: {
        ...state.profile,
        photos: updatedPhotos,
      },
    }));
  },

  removePhoto: (mediaId: string) => {
    set((state) => ({
      profile: {
        ...state.profile,
        photos: state.profile.photos.filter((p) => p.media_id !== mediaId),
      },
    }));
  },

  reorderPhotos: (fromIndex: number, toIndex: number) => {
    const photos = [...get().profile.photos];
    const [moved] = photos.splice(fromIndex, 1);
    photos.splice(toIndex, 0, moved);
    const updated = photos.map((p, idx) => ({ ...p, display_order: idx }));
    set((state) => ({
      profile: {
        ...state.profile,
        photos: updated,
      },
    }));
  },
}));

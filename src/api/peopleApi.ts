import { apiClient, USE_MOCK_API } from './client';
import { UserProfile, UpdateProfileRequest, PresignedUploadResponse } from '../types/profile.types';
import { CURRENT_USER, MOCK_DISCOVERY_PROFILES } from './mock/mockData';

export const peopleApi = {
  async getMyProfile(): Promise<UserProfile> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return { ...CURRENT_USER };
    }
    const response = await apiClient.get<UserProfile>('/profiles/me');
    return response.data;
  },

  async updateMyProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      Object.assign(CURRENT_USER, data);
      return { ...CURRENT_USER };
    }
    const response = await apiClient.post<UserProfile>('/profiles/me', data);
    return response.data;
  },

  async getPresignedUploadUrl(filename: string, contentType: string): Promise<PresignedUploadResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      const key = `users/usr_me_001/${Date.now()}_${filename}`;
      return {
        upload_url: `https://r2-mock.storage.cloudflare.com/${key}`,
        r2_object_key: key,
        public_media_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80`,
      };
    }
    const response = await apiClient.get<PresignedUploadResponse>('/media/upload-url', {
      params: { filename, contentType },
    });
    return response.data;
  },

  async getDiscoveryFeed(): Promise<UserProfile[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return [...MOCK_DISCOVERY_PROFILES];
    }
    const response = await apiClient.get<UserProfile[]>('/discovery/feed');
    return response.data;
  },
};

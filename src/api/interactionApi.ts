import { apiClient, USE_MOCK_API } from './client';
import { SwipeRequest, SwipeResponse, MatchSummary } from '../types/interaction.types';
import { MOCK_DISCOVERY_PROFILES, MOCK_MATCHES } from './mock/mockData';

export const interactionApi = {
  async recordSwipe(data: SwipeRequest): Promise<SwipeResponse> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 250));
      // For demonstration, LIKE or SUPERLIKE on Yuki or Elena will trigger a mutual match
      const target = MOCK_DISCOVERY_PROFILES.find((p) => p.user_id === data.target_user_id);
      const isMatch = (data.action === 'LIKE' || data.action === 'SUPERLIKE') && 
                      (target?.first_name === 'Yuki' || target?.first_name === 'Elena' || Math.random() > 0.4);

      let match: MatchSummary | undefined;
      if (isMatch && target) {
        match = {
          match_id: `match_${Date.now()}`,
          user_one_id: 'usr_me_001',
          user_two_id: target.user_id,
          partner_profile: target,
          unread_count: 0,
          is_active: true,
          created_at: new Date().toISOString(),
        };
      }

      return {
        swipe_id: `swp_${Date.now()}`,
        action: data.action,
        is_match: isMatch,
        match,
      };
    }
    const response = await apiClient.post<SwipeResponse>('/swipes', data);
    return response.data;
  },

  async getMatches(): Promise<MatchSummary[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 350));
      return [...MOCK_MATCHES];
    }
    const response = await apiClient.get<MatchSummary[]>('/matches');
    return response.data;
  },
};

import { UserProfile } from './profile.types';

export type SwipeAction = 'LIKE' | 'PASS' | 'SUPERLIKE';

export interface SwipeRequest {
  target_user_id: string;
  action: SwipeAction;
}

export interface SwipeResponse {
  swipe_id: string;
  action: SwipeAction;
  is_match: boolean;
  match?: MatchSummary;
}

export interface MatchSummary {
  match_id: string;
  user_one_id: string;
  user_two_id: string;
  partner_profile: UserProfile;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
  is_active: boolean;
  created_at: string;
}

export interface DiscoveryFeedQuery {
  page?: number;
  limit?: number;
  max_distance_km?: number;
  age_min?: number;
  age_max?: number;
}

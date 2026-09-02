export interface ProfileMedia {
  media_id: string;
  user_id: string;
  r2_object_key: string;
  media_url: string;
  display_order: number;
  created_at: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export type GenderType = 'MAN' | 'WOMAN' | 'NON_BINARY' | 'OTHER';
export type InterestedInType = 'MEN' | 'WOMEN' | 'EVERYONE';

export interface UserProfile {
  user_id: string;
  first_name: string;
  birthdate: string; // ISO date YYYY-MM-DD
  age?: number;
  gender: GenderType;
  interested_in: InterestedInType;
  bio: string;
  location: UserLocation;
  distance_km?: number;
  max_distance_km: number;
  age_min_pref: number;
  age_max_pref: number;
  is_active: boolean;
  is_verified?: boolean;
  interest_tags: string[];
  photos: ProfileMedia[];
  job_title?: string;
  company?: string;
  school?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  birthdate?: string;
  gender?: GenderType;
  interested_in?: InterestedInType;
  bio?: string;
  location?: UserLocation;
  max_distance_km?: number;
  age_min_pref?: number;
  age_max_pref?: number;
  interest_tags?: string[];
  job_title?: string;
  company?: string;
  school?: string;
}

export interface PresignedUploadResponse {
  upload_url: string;
  r2_object_key: string;
  public_media_url: string;
}

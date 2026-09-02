import { UserProfile } from './profile.types';
import { Conversation } from './chat.types';

export type RootStackParamList = {
  Auth: undefined;
  ProfileBuilder: undefined;
  MainTabs: undefined;
  ChatRoom: {
    matchId: string;
    partnerProfile: {
      userId: string;
      name: string;
      avatar: string;
      isOnline?: boolean;
      isVerified?: boolean;
    };
  };
  WebRTCCall: {
    matchId: string;
    partnerId: string;
    partnerName: string;
    partnerAvatar: string;
    callType: 'AUDIO' | 'VIDEO';
    isIncoming?: boolean;
  };
  ProfileDetailModal: {
    profile: UserProfile;
  };
};

export type MainTabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Profile: undefined;
  Settings: undefined;
};

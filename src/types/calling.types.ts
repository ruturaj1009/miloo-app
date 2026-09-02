export type CallType = 'AUDIO' | 'VIDEO';
export type CallStatus = 'IDLE' | 'CALLING' | 'RINGING' | 'CONNECTED' | 'ENDED' | 'REJECTED';

export interface CallSession {
  session_id: string;
  match_id: string;
  caller_id: string;
  receiver_id: string;
  caller_name: string;
  caller_avatar: string;
  receiver_name: string;
  receiver_avatar: string;
  call_type: CallType;
  status: CallStatus;
  started_at?: string;
  duration_seconds: number;
  is_audio_muted: boolean;
  is_video_muted: boolean;
  is_front_camera: boolean;
  is_speaker_on: boolean;
}

export type SignalingMessageType = 
  | 'OFFER'
  | 'ANSWER'
  | 'ICE_CANDIDATE'
  | 'CALL_INVITE'
  | 'CALL_ACCEPT'
  | 'CALL_REJECT'
  | 'CALL_END';

export interface SignalingPayload {
  type: SignalingMessageType;
  sessionId: string;
  senderId: string;
  targetId: string;
  sdp?: any;
  candidate?: any;
  callType?: CallType;
}

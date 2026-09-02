import { create } from 'zustand';
import { CallSession, CallStatus, CallType } from '../types/calling.types';
import { socketClient } from '../api/socketClient';

interface CallState {
  activeSession: CallSession | null;
  isIncomingCallModalVisible: boolean;
  
  startCall: (params: {
    matchId: string;
    targetId: string;
    targetName: string;
    targetAvatar: string;
    callType: CallType;
  }) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  flipCamera: () => void;
  toggleSpeaker: () => void;
  incrementDuration: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  activeSession: null,
  isIncomingCallModalVisible: false,

  startCall: (params) => {
    const session: CallSession = {
      session_id: `call_${Date.now()}`,
      match_id: params.matchId,
      caller_id: 'usr_me_001',
      receiver_id: params.targetId,
      caller_name: 'Alex',
      caller_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      receiver_name: params.targetName,
      receiver_avatar: params.targetAvatar,
      call_type: params.callType,
      status: 'CALLING',
      duration_seconds: 0,
      is_audio_muted: false,
      is_video_muted: false,
      is_front_camera: true,
      is_speaker_on: true,
    };

    set({ activeSession: session });

    socketClient.sendSignaling({
      type: 'CALL_INVITE',
      sessionId: session.session_id,
      senderId: 'usr_me_001',
      targetId: params.targetId,
      callType: params.callType,
    });

    // Simulate partner picking up the call after 2.5s for seamless interactive demonstration
    setTimeout(() => {
      if (get().activeSession?.status === 'CALLING') {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, status: 'CONNECTED', started_at: new Date().toISOString() }
            : null,
        }));
      }
    }, 2500);
  },

  acceptCall: () => {
    set((state) => ({
      isIncomingCallModalVisible: false,
      activeSession: state.activeSession
        ? { ...state.activeSession, status: 'CONNECTED', started_at: new Date().toISOString() }
        : null,
    }));
  },

  rejectCall: () => {
    set({
      isIncomingCallModalVisible: false,
      activeSession: null,
    });
  },

  endCall: () => {
    const session = get().activeSession;
    if (session) {
      socketClient.sendSignaling({
        type: 'CALL_END',
        sessionId: session.session_id,
        senderId: 'usr_me_001',
        targetId: session.receiver_id,
      });
    }
    set({
      activeSession: null,
      isIncomingCallModalVisible: false,
    });
  },

  toggleAudio: () => {
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, is_audio_muted: !state.activeSession.is_audio_muted }
        : null,
    }));
  },

  toggleVideo: () => {
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, is_video_muted: !state.activeSession.is_video_muted }
        : null,
    }));
  },

  flipCamera: () => {
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, is_front_camera: !state.activeSession.is_front_camera }
        : null,
    }));
  },

  toggleSpeaker: () => {
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, is_speaker_on: !state.activeSession.is_speaker_on }
        : null,
    }));
  },

  incrementDuration: () => {
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, duration_seconds: state.activeSession.duration_seconds + 1 }
        : null,
    }));
  },
}));

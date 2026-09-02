import { create } from 'zustand';
import { ChatMessage, Conversation } from '../types/chat.types';
import { chatApi } from '../api/chatApi';
import { socketClient } from '../api/socketClient';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, boolean>; // matchId -> boolean
  isLoadingMessages: boolean;
  isLoadingConversations: boolean;

  fetchConversations: () => Promise<void>;
  fetchMessages: (matchId: string) => Promise<void>;
  sendMessage: (matchId: string, recipientId: string, content: string, mediaUrl?: string) => Promise<void>;
  receiveMessage: (message: ChatMessage) => void;
  setTyping: (matchId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  typingUsers: {},
  isLoadingMessages: false,
  isLoadingConversations: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const list = await chatApi.getConversations();
      set({ conversations: list, isLoadingConversations: false });
    } catch (e) {
      set({ isLoadingConversations: false });
    }
  },

  fetchMessages: async (matchId: string) => {
    set({ isLoadingMessages: true });
    try {
      const history = await chatApi.getChatHistory(matchId);
      set((state) => ({
        messages: {
          ...state.messages,
          [matchId]: history,
        },
        isLoadingMessages: false,
      }));
    } catch (e) {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (matchId: string, recipientId: string, content: string, mediaUrl?: string) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      message_id: tempId,
      match_id: matchId,
      sender_id: 'usr_me_001',
      recipient_id: recipientId,
      content,
      media_url: mediaUrl,
      is_read: false,
      is_pending: true,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Optimistic append
    const currentList = get().messages[matchId] || [];
    set((state) => ({
      messages: {
        ...state.messages,
        [matchId]: [...currentList, optimisticMessage],
      },
    }));

    try {
      const sent = await chatApi.sendMessage({
        match_id: matchId,
        recipient_id: recipientId,
        content,
        media_url: mediaUrl,
      });

      // Replace temp with confirmed message
      set((state) => ({
        messages: {
          ...state.messages,
          [matchId]: (state.messages[matchId] || []).map((m) =>
            m.message_id === tempId ? { ...sent, is_pending: false } : m
          ),
        },
      }));

      // Simulate a realistic partner response after 3 seconds for rich demonstration
      if (recipientId === 'usr_002' || recipientId === 'usr_001') {
        setTimeout(() => {
          get().setTyping(matchId, true);
          setTimeout(() => {
            get().setTyping(matchId, false);
            const replies = [
              "That sounds amazing! Can't wait. ✨",
              "Let's definitely grab coffee together! ☕",
              "I love that place too! When are you free?",
              "Haha totally agree! 😄",
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const incoming: ChatMessage = {
              message_id: `msg_in_${Date.now()}`,
              match_id: matchId,
              sender_id: recipientId,
              recipient_id: 'usr_me_001',
              content: reply,
              is_read: true,
              created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            get().receiveMessage(incoming);
          }, 2500);
        }, 1500);
      }
    } catch (e) {
      set((state) => ({
        messages: {
          ...state.messages,
          [matchId]: (state.messages[matchId] || []).map((m) =>
            m.message_id === tempId ? { ...m, is_pending: false, is_failed: true } : m
          ),
        },
      }));
    }
  },

  receiveMessage: (incoming: ChatMessage) => {
    const list = get().messages[incoming.match_id] || [];
    set((state) => ({
      messages: {
        ...state.messages,
        [incoming.match_id]: [...list, incoming],
      },
      conversations: state.conversations.map((c) =>
        c.match_id === incoming.match_id
          ? {
              ...c,
              last_message: incoming.content,
              last_message_time: incoming.created_at,
              unread_count: c.unread_count + 1,
            }
          : c
      ),
    }));
  },

  setTyping: (matchId: string, isTyping: boolean) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [matchId]: isTyping,
      },
    }));
  },
}));

import { apiClient, USE_MOCK_API } from './client';
import { ChatMessage, SendMessageRequest, Conversation } from '../types/chat.types';
import { MOCK_CHAT_MESSAGES, MOCK_MATCHES } from './mock/mockData';

export const chatApi = {
  async getChatHistory(matchId: string): Promise<ChatMessage[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_CHAT_MESSAGES[matchId] ? [...MOCK_CHAT_MESSAGES[matchId]] : [];
    }
    const response = await apiClient.get<ChatMessage[]>(`/chat/${matchId}/history`);
    return response.data;
  },

  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 150));
      const newMsg: ChatMessage = {
        message_id: `msg_${Date.now()}`,
        match_id: data.match_id,
        sender_id: 'usr_me_001',
        recipient_id: data.recipient_id,
        content: data.content,
        media_url: data.media_url,
        is_read: false,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (!MOCK_CHAT_MESSAGES[data.match_id]) {
        MOCK_CHAT_MESSAGES[data.match_id] = [];
      }
      MOCK_CHAT_MESSAGES[data.match_id].push(newMsg);
      return newMsg;
    }
    const response = await apiClient.post<ChatMessage>(`/chat/${data.match_id}/messages`, data);
    return response.data;
  },

  async getConversations(): Promise<Conversation[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_MATCHES.map((m) => ({
        match_id: m.match_id,
        partner_id: m.partner_profile.user_id,
        partner_name: m.partner_profile.first_name,
        partner_avatar: m.partner_profile.photos[0]?.media_url || '',
        is_online: m.partner_profile.first_name === 'Elena' || m.partner_profile.first_name === 'Yuki',
        is_verified: m.partner_profile.is_verified,
        last_message: m.last_message,
        last_message_time: m.last_message_at,
        unread_count: m.unread_count || 0,
      }));
    }
    const response = await apiClient.get<Conversation[]>('/chat/conversations');
    return response.data;
  },
};
